const express = require('express');
const http = require('http');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Server } = require('socket.io');
const path = require('path');
const db = require('./database');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'smart_ration_system_jwt_token_secret_key_123';

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route: serve landing page as the entry point (must be before static middleware)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/landing.html'));
});

// Serve static frontend files (index: false so our custom GET / route serves landing.html)
app.use(express.static(path.join(__dirname, '../frontend'), { index: false }));


// Socket.IO Connection Handler
io.on('connection', (socket) => {
  console.log(`Socket client connected: ${socket.id}`);
  
  socket.on('join_shop', (shopId) => {
    socket.join(`shop_${shopId}`);
    console.log(`Socket ${socket.id} joined room: shop_${shopId}`);
  });

  socket.on('disconnect', () => {
    console.log(`Socket client disconnected: ${socket.id}`);
  });
});

// Broadcast Helper
function broadcastToShop(shopId, event, data) {
  io.to(`shop_${shopId}`).emit(event, data);
  io.emit(event, data); // Real-time sync across all connected clients
  io.emit('global_update', { event, shopId, data }); // Global notification for admins
}

// Security Middleware: Authenticate Token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'Access token required.' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token.' });
    req.user = user;
    next();
  });
}

// Security Middleware: Authorize Roles
function checkRole(allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Unauthorized access. Insufficient permissions.' });
    }
    next();
  };
}

// ==========================================
// AUTHENTICATION ROUTES
// ==========================================

app.post('/api/auth/register', async (req, res) => {
  const { username, password, role, name, mobile, shopId, cardType, familyMembers, monthlyIncome } = req.body;

  try {
    if (!username || !password || !role) {
      return res.status(400).json({ error: 'Username, password, and role are required.' });
    }

    const existingUser = await db.getUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ error: 'Username is already taken.' });
    }

    // Hash password
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    // Write to DB via unified database adapter (Supabase or SQLite)
    await db.registerUser({
      username,
      passwordHash,
      role,
      name,
      mobile,
      shopId,
      cardType,
      familyMembers,
      monthlyIncome
    });

    res.status(201).json({ message: 'User registered successfully!' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: err.message || 'Registration failed.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { username, password, role } = req.body;

  try {
    if (!username || !password || !role) {
      return res.status(400).json({ error: 'Username, password, and role are required.' });
    }

    const user = await db.getUserByUsername(username);
    if (!user || user.role !== role) {
      return res.status(401).json({ error: 'Invalid username, role, or credentials.' });
    }

    // Verify Password
    const passwordMatch = bcrypt.compareSync(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid password credentials.' });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Fetch role specific profile
    let profile = null;
    if (role === 'beneficiary') {
      profile = await db.getBeneficiaryProfileByUserId(user.id);
    } else if (role === 'dealer') {
      profile = await db.getDealerProfileByUserId(user.id);
    } else if (role === 'admin') {
      profile = await db.getAdminProfileByUserId(user.id);
    }

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        profile: profile
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Password recovery API mocks (using simulated OTP)
app.post('/api/auth/forgot-password', (req, res) => {
  const { username, mobile } = req.body;
  if (!username) return res.status(400).json({ error: 'Ration Number/ID is required.' });
  
  // Simulated OTP generation
  const otp = Math.floor(100000 + Math.random() * 900000);
  console.log(`OTP generated for user ${username}: ${otp}`);
  
  res.json({
    message: 'OTP sent successfully to registered mobile number.',
    otp_session_id: 'session_' + Math.random().toString(36).substr(2, 9),
    simulated_otp: otp // Send it in response for debugging ease in this working prototype
  });
});

app.post('/api/auth/verify-otp', async (req, res) => {
  const { username, otp, newPassword } = req.body;
  if (!username || !otp || !newPassword) return res.status(400).json({ error: 'All fields are required.' });

  try {
    const user = await db.getUserByUsername(username);
    if (!user) return res.status(404).json({ error: 'User not found.' });

    // In prototype, we accept any 6-digit OTP for convenience, or they can use the simulated_otp
    const salt = bcrypt.genSaltSync(10);
    const newHash = bcrypt.hashSync(newPassword, salt);

    const sqlite3 = require('sqlite3').verbose();
    const sqliteDb = new sqlite3.Database(path.resolve(__dirname, 'ration_booking.db'));
    sqliteDb.run("UPDATE users SET password_hash = ? WHERE id = ?", [newHash, user.id], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Password reset successful. Please log in.' });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// BENEFICIARY / USER PORTAL ROUTES
// ==========================================

app.get('/api/beneficiary/dashboard', authenticateToken, checkRole(['beneficiary']), async (req, res) => {
  try {
    const profile = await db.getBeneficiaryProfileByUserId(req.user.userId);
    if (!profile) return res.status(404).json({ error: 'Beneficiary profile not found.' });

    const bookings = await db.getBeneficiaryBookings(profile.id);
    const stock = await db.getShopStock(profile.ration_shop_id);

    // Fetch unread notifications
    const notifications = await db.getNotifications(req.user.userId);
    
    res.json({
      profile,
      bookings,
      shopStock: stock,
      notifications
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Available slots for booking
app.get('/api/beneficiary/slots', authenticateToken, checkRole(['beneficiary', 'dealer']), async (req, res) => {
  const { shopId, date } = req.query;
  try {
    if (!shopId || !date) return res.status(400).json({ error: 'Shop ID and date are required.' });
    const slots = await db.getSlotsByShopAndDate(parseInt(shopId), date);
    res.json(slots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Book Slot
app.post('/api/beneficiary/book', authenticateToken, checkRole(['beneficiary']), async (req, res) => {
  const { shopId, slotId, date, timeSlot, commodities } = req.body;
  try {
    const profile = await db.getBeneficiaryProfileByUserId(req.user.userId);
    if (!profile) return res.status(404).json({ error: 'Beneficiary profile not found.' });

    // Check duplicate booking (prevent multiple bookings for the same beneficiary on the same date)
    const duplicate = await db.checkDuplicateBooking(profile.id, date);
    if (duplicate) {
      return res.status(400).json({ error: 'You already have an active booking on this date. Please choose another date or reschedule your existing booking.' });
    }

    const bookingResult = await db.createBooking(profile.id, parseInt(shopId), parseInt(slotId), date, timeSlot, commodities, 'beneficiary');
    
    // Broadcast real-time update to dealer and admin dashboards
    broadcastToShop(shopId, 'booking_updated', { shopId, date });

    res.status(201).json(bookingResult);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reschedule Booking
app.post('/api/beneficiary/reschedule', authenticateToken, checkRole(['beneficiary']), async (req, res) => {
  const { bookingId, newSlotId, newDate, newTimeSlot } = req.body;
  try {
    const result = await db.rescheduleBooking(bookingId, parseInt(newSlotId), newDate, newTimeSlot);
    
    // Broadcast real-time update to dealer and admin dashboards
    if (result.ration_shop_id) {
      broadcastToShop(result.ration_shop_id, 'booking_updated', { shopId: result.ration_shop_id, date: newDate });
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Cancel Booking
app.post('/api/beneficiary/cancel', authenticateToken, checkRole(['beneficiary']), async (req, res) => {
  const { bookingId } = req.body;
  try {
    const result = await db.cancelBooking(bookingId);
    
    if (result.ration_shop_id) {
      broadcastToShop(result.ration_shop_id, 'booking_updated', { shopId: result.ration_shop_id, date: result.booking_date });
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// DEALER PORTAL ROUTES
// ==========================================

app.get('/api/dealer/dashboard', authenticateToken, checkRole(['dealer']), async (req, res) => {
  try {
    const profile = await db.getDealerProfileByUserId(req.user.userId);
    if (!profile) return res.status(404).json({ error: 'Dealer profile not found.' });

    const dashboardData = await db.getDealerDashboard(profile.ration_shop_id);
    res.json({
      profile,
      ...dashboardData
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// QR Check-in
app.post('/api/dealer/check-in', authenticateToken, checkRole(['dealer']), async (req, res) => {
  const { bookingId } = req.body;
  try {
    if (!bookingId) return res.status(400).json({ error: 'Booking ID is required.' });
    const result = await db.verifyQRAndCheckIn(bookingId);
    
    // Broadcast check-in event to update dealer real-time screen
    if (result.booking && result.booking.ration_shop_id) {
      broadcastToShop(result.booking.ration_shop_id, 'booking_updated', { shopId: result.booking.ration_shop_id, date: result.booking.booking_date });
    }

    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Distribute Ration
app.post('/api/dealer/distribute', authenticateToken, checkRole(['dealer']), async (req, res) => {
  const { bookingId, commodities } = req.body;
  try {
    const result = await db.recordDistribution(bookingId, commodities, req.user.userId);
    
    // Broadcast real-time stock and completed distributions updates
    if (result.ration_shop_id) {
      broadcastToShop(result.ration_shop_id, 'stock_updated', { shopId: result.ration_shop_id });
      broadcastToShop(result.ration_shop_id, 'booking_updated', { shopId: result.ration_shop_id, date: result.booking_date });
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Assisted Booking (Dealer Books for Beneficiary)
app.post('/api/dealer/assisted-booking', authenticateToken, checkRole(['dealer']), async (req, res) => {
  const { qRationNumber, slotId, date, timeSlot, commodities } = req.body;
  try {
    const beneficiary = await db.verifyBeneficiaryByRation(qRationNumber);
    if (!beneficiary) {
      return res.status(404).json({ error: 'Invalid Q Ration Number. Beneficiary not found.' });
    }

    const duplicate = await db.checkDuplicateBooking(beneficiary.id, date);
    if (duplicate) {
      return res.status(400).json({ error: 'Beneficiary already has an active booking on this date.' });
    }

    const bookingResult = await db.createBooking(beneficiary.id, beneficiary.ration_shop_id, parseInt(slotId), date, timeSlot, commodities, 'dealer');
    
    // Broadcast real-time update
    broadcastToShop(beneficiary.ration_shop_id, 'booking_updated', { shopId: beneficiary.ration_shop_id, date });

    res.status(201).json({
      ...bookingResult,
      beneficiary_name: beneficiary.name
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add Stock
app.post('/api/dealer/add-stock', authenticateToken, checkRole(['dealer']), async (req, res) => {
  const { commodityId, quantity, referenceId } = req.body;
  try {
    const profile = await db.getDealerProfileByUserId(req.user.userId);
    if (!profile) return res.status(404).json({ error: 'Dealer profile not found.' });

    const result = await db.addShopStock(profile.ration_shop_id, parseInt(commodityId), parseFloat(quantity), referenceId, req.user.userId);
    
    // Broadcast stock updates
    broadcastToShop(profile.ration_shop_id, 'stock_updated', { shopId: profile.ration_shop_id });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Verify Beneficiary details by Ration Number
app.get('/api/dealer/verify-beneficiary', authenticateToken, checkRole(['dealer']), async (req, res) => {
  const { rationNumber } = req.query;
  try {
    const beneficiary = await db.verifyBeneficiaryByRation(rationNumber);
    if (!beneficiary) return res.status(404).json({ error: 'Beneficiary not found.' });
    res.json(beneficiary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// GOVERNMENT ADMIN ROUTES
// ==========================================

app.get('/api/admin/dashboard', authenticateToken, checkRole(['admin']), async (req, res) => {
  const filters = req.query;
  try {
    const metrics = await db.getAdminMetrics(filters);
    const shops = await db.getRationShops();
    const auditLogs = await db.getAuditLogs();
    
    res.json({
      metrics,
      shops,
      auditLogs
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admin/dealers', authenticateToken, checkRole(['admin']), async (req, res) => {
  try {
    const dealers = await db.getDealersWithShopInfo();
    res.json(dealers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/shops', authenticateToken, checkRole(['admin']), async (req, res) => {
  const { shopName, shopCode, locationId, address, contact } = req.body;
  try {
    const result = await db.addRationShop(shopName, shopCode, parseInt(locationId), address, contact);
    res.status(201).json({ success: true, shopId: result.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/shops/:id', authenticateToken, checkRole(['admin']), async (req, res) => {
  const { shopName, address, contact } = req.body;
  try {
    const result = await db.editRationShop(parseInt(req.params.id), shopName, address, contact);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/shops/:id', authenticateToken, checkRole(['admin']), async (req, res) => {
  try {
    const result = await db.deleteRationShop(parseInt(req.params.id));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// CHATBOT SERVICE API
// ==========================================

app.post('/api/chatbot/message', async (req, res) => {
  const { message, language } = req.body;
  let user = null;
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    if (token) {
      try {
        user = jwt.verify(token, JWT_SECRET);
      } catch (e) {
        // Token expired or invalid, treat as guest
      }
    }
  }
  try {
    const result = await db.chatbotQuery(message, language || 'en', user);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// MACHINE LEARNING CLASSIFICATION PROXY
// ==========================================

app.post('/api/ml/predict', async (req, res) => {
  try {
    // Attempt to proxy to Flask ML Service
    const flaskUrl = 'http://127.0.0.1:5000/predict';
    
    const response = await fetch(flaskUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });

    if (response.ok) {
      const data = await response.json();
      return res.json(data);
    } else {
      throw new Error("Flask service error status: " + response.status);
    }
  } catch (err) {
    console.warn("Flask ML Service unreachable. Falling back to Node.js rule-based classifier: ", err.message);
    
    // Node.js Rule-Based Classifier Fallback
    const { monthly_income, gas_connection } = req.body;
    let prediction = 'NPHH';
    let confidence = 0.95;
    
    const income = parseFloat(monthly_income || 0);
    const gas = parseInt(gas_connection || 0);
    
    if (income <= 2500 && gas === 0) {
      prediction = 'AAY';
      confidence = 0.85;
    } else if (income <= 12000) {
      prediction = 'PHH';
      confidence = 0.88;
    } else {
      prediction = 'NPHH';
      confidence = 0.92;
    }

    res.json({
      prediction,
      confidence,
      note: 'Note: Flask ML server was offline. Used local rule-based classifier fallback (August 2026 update).'
    });
  }
});

// Notification marker
app.post('/api/notifications/mark-read', authenticateToken, (req, res) => {
  const sqlite3 = require('sqlite3').verbose();
  const sqliteDb = new sqlite3.Database(path.resolve(__dirname, 'ration_booking.db'));
  sqliteDb.run("UPDATE notifications SET is_read = 1 WHERE user_id = ?", [req.user.userId], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// Initialize database schema and start server
db.initDb().then(() => {
  server.listen(PORT, () => {
    console.log(`Smart PDS Server running locally on: http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error("Failed to initialize database: ", err);
});
