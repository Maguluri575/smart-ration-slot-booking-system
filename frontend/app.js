// app.js - Main Application Client for Smart Ration PDS System

const API_BASE = window.location.origin;
let socket = null;

// App State
const state = {
  token: localStorage.getItem('pds_token') || null,
  user: JSON.parse(localStorage.getItem('pds_user')) || null,
  activeRole: (new URLSearchParams(window.location.search).get('role') && ['beneficiary', 'dealer', 'admin'].includes(new URLSearchParams(window.location.search).get('role'))) ? new URLSearchParams(window.location.search).get('role') : 'beneficiary', // current tab role selected
  lang: localStorage.getItem('pds_lang') || 'en',
  theme: localStorage.getItem('pds_theme') || 'light',
  
  // Dashboards Cache
  beneficiaryDashboard: null,
  dealerDashboard: null,
  adminDashboard: null,
  
  // Booking Modal State
  bookingSelectedDate: null,
  bookingSelectedSlotId: null,
  bookingSelectedSlotTime: null,
  bookingRescheduleTargetId: null, // set if rescheduling
  
  // Charts Cache
  dealerChart: null,
  adminSupplyChart: null,
  adminCompletionChart: null
};

// ==========================================
// TRANSLATION ENGINE BRIDGE
// Comprehensive translations and phrase dictionary are powered globally by i18n.js
// ==========================================
if (typeof updateTranslations === 'undefined') {
  window.updateTranslations = function(lang) {
    state.lang = lang;
    localStorage.setItem('pds_lang', lang);
  };
}


// ==========================================
// THEME SWITCHER LOGIC
// ==========================================
function initTheme() {
  if (state.theme === 'dark') {
    document.body.classList.add('dark-theme');
    document.getElementById('theme-toggle-btn').innerHTML = '<i class="fas fa-sun"></i>';
  } else {
    document.body.classList.remove('dark-theme');
    document.getElementById('theme-toggle-btn').innerHTML = '<i class="fas fa-moon"></i>';
  }
}

document.getElementById('theme-toggle-btn').addEventListener('click', () => {
  if (state.theme === 'light') {
    state.theme = 'dark';
    document.body.classList.add('dark-theme');
    document.getElementById('theme-toggle-btn').innerHTML = '<i class="fas fa-sun"></i>';
  } else {
    state.theme = 'light';
    document.body.classList.remove('dark-theme');
    document.getElementById('theme-toggle-btn').innerHTML = '<i class="fas fa-moon"></i>';
  }
  localStorage.setItem('pds_theme', state.theme);
});

// ==========================================
// REAL-TIME SOCKET.IO ENGINE
// ==========================================
function initSocket() {
  if (socket) return;
  if (typeof io === 'undefined') {
    console.warn("Socket.io library not loaded. Real-time updates disabled.");
    return;
  }
  
  // Load socket.io client dynamically
  socket = io(API_BASE);

  socket.on('connect', () => {
    console.log("Connected to Real-time Notification Engine");
    if (state.user && state.user.profile && state.user.profile.ration_shop_id) {
      socket.emit('join_shop', state.user.profile.ration_shop_id);
    }
  });

  // Real-time updates handler
  socket.on('booking_updated', (data) => {
    console.log("Real-time Alert: Bookings Updated!", data);
    if (state.user) {
      if (state.user.role === 'beneficiary') {
        fetchBeneficiaryDashboard();
        if (state.bookingSelectedDate) {
          loadSlotsForDate(state.bookingSelectedDate);
        }
      } else if (state.user.role === 'dealer') {
        fetchDealerDashboard();
      } else if (state.user.role === 'admin') {
        fetchAdminDashboard();
      }
    }
  });

  socket.on('stock_updated', (data) => {
    console.log("Real-time Alert: Stock level modified!", data);
    const dealerPortal = document.getElementById('dealer-portal');
    const isDealerActive = (state.user && state.user.role === 'dealer') || (dealerPortal && dealerPortal.style.display !== 'none');
    if (isDealerActive) {
      fetchDealerDashboard();
    } else if (state.user && state.user.role === 'beneficiary') {
      fetchBeneficiaryDashboard();
    }
  });

  socket.on('global_update', (data) => {
    console.log("Global admin monitor sync received: ", data);
    if (state.user && state.user.role === 'admin') {
      fetchAdminDashboard();
    }
  });
}

// ==========================================
// BENEFICIARY PORTAL LOGIC & DASHBOARD
// ==========================================

async function fetchBeneficiaryDashboard() {
  if (!state.token) return;
  try {
    const res = await fetch(`${API_BASE}/api/beneficiary/dashboard`, {
      headers: { 'Authorization': `Bearer ${state.token}` }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    
    state.beneficiaryDashboard = data;
    renderBeneficiaryDashboard();
  } catch (err) {
    console.error("Dashboard fetch error:", err.message);
  }
}

function renderBeneficiaryDashboard() {
  const data = state.beneficiaryDashboard;
  if (!data) return;
  
  // Profile displays
  document.getElementById('ben-name-display').innerText = data.profile.name;
  
  // Mask Ration Number for security (e.g. RATION999 -> RAT***999)
  const rat = data.profile.q_ration_number;
  const maskedRat = rat.substring(0, 3) + "***" + rat.substring(rat.length - 3);
  document.getElementById('ben-ration-display').innerText = maskedRat;
  
  document.getElementById('ben-card-badge').innerText = data.profile.card_type;
  // document.getElementById('ben-shop-display').innerText = data.profile.shop_name;
  // document.getElementById('ben-location-display').innerText = `${data.profile.mandal}, ${data.profile.district}`;

  // Bell badge counts
  const unreadNotifications = data.notifications.filter(n => !n.is_read).length;
  const badge = document.getElementById('notification-badge');
  if (unreadNotifications > 0) {
    badge.innerText = unreadNotifications;
    badge.style.display = "flex";
  } else {
    badge.style.display = "none";
  }

  // Populate Notifications panel
  const notificationList = document.getElementById('notification-list');
  notificationList.innerHTML = '';
  if (data.notifications.length === 0) {
    notificationList.innerHTML = `<div class="notification-item">No alerts/notifications.</div>`;
  } else {
    data.notifications.forEach(n => {
      const item = document.createElement('div');
      item.className = `notification-item ${n.is_read ? '' : 'unread'}`;
      item.innerHTML = `
        <h4>${n.title}</h4>
        <p>${n.message}</p>
        <small style="color: var(--text-muted);">${new Date(n.created_at).toLocaleString()}</small>
      `;
      notificationList.appendChild(item);
    });
  }

  // The Quota table has been replaced with the Date & Time Picker UI
  // which does not require initialization here for now.

  // Deduplicate bookings by booking_id to guarantee no duplicate values appear
  const seenBookingIds = new Set();
  const uniqueBookings = [];
  (data.bookings || []).forEach(b => {
    if (!seenBookingIds.has(b.booking_id) && b.status !== 'RESCHEDULED' && b.status !== 'CANCELLED') {
      seenBookingIds.add(b.booking_id);
      uniqueBookings.push(b);
    }
  });

  // Upcoming slot booking card - Show ONLY slots that are NOT checked in yet
  const bookingBox = document.getElementById('upcoming-booking-box');
  // Filter for active slots pending check-in (BOOKED or MISSED). Checked-in and completed slots belong in history only.
  const notCheckedInList = uniqueBookings.filter(b => b.status === 'BOOKED' || b.status === 'MISSED');
  
  if (notCheckedInList.length > 0) {
    bookingBox.innerHTML = '';
    notCheckedInList.forEach((upcoming, idx) => {
      const isMissed = upcoming.status === 'MISSED';
      const card = document.createElement('div');
      card.className = 'crowd-recommendation';
      card.style.cssText = 'background-color: var(--primary-glow); border-color: var(--primary); display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 0.85rem; padding: 1.1rem; border-radius: var(--radius-sm);';
      card.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
          <h4 style="font-size: 0.98rem; font-weight: 700; color: var(--primary); margin: 0;">
            <i class="fas fa-calendar-alt"></i> Active Slot #${idx + 1} (${upcoming.booking_id})
          </h4>
          <span class="badge ${isMissed ? 'status-missed' : 'status-booked'}">
            <i class="${isMissed ? 'fas fa-exclamation-triangle' : 'fas fa-clock'}"></i>
            ${isMissed ? 'MISSED - RESCHEDULE' : 'NOT CHECKED IN'}
          </span>
        </div>
        <p style="margin: 0.2rem 0; font-size: 0.9rem; color: var(--text-secondary);">
          <i class="fas fa-calendar-day"></i> <strong>Date:</strong> ${upcoming.booking_date} &nbsp;|&nbsp; 
          <i class="fas fa-clock"></i> <strong>Time:</strong> ${upcoming.time_slot} &nbsp;|&nbsp;
          <i class="fas fa-store"></i> <strong>Shop:</strong> ${upcoming.shop_name || 'Designated PDS Shop'}
        </p>
        <div style="display: flex; gap: 0.5rem; margin-top: 0.4rem; flex-wrap: wrap;">
          <button class="btn-primary" style="padding: 0.45rem 0.85rem; font-size: 0.82rem; flex: 1; min-width: 140px;" onclick="openReceiptModal('${upcoming.booking_id}', '${upcoming.q_ration_number || data.profile.q_ration_number}', '${upcoming.booking_date}', '${upcoming.time_slot}', '${upcoming.shop_name}')">
            <i class="fas fa-qrcode"></i> View QR Receipt
          </button>
          <button class="btn-secondary" style="padding: 0.45rem 0.85rem; font-size: 0.82rem; flex: 1; min-width: 140px; background-color: #f59e0b; color: white; border: none; font-weight: 600;" onclick="initRescheduling('${upcoming.booking_id}')">
            <i class="fas fa-calendar-alt"></i> Reschedule Slot
          </button>
          <button class="btn-secondary" style="padding: 0.45rem 0.85rem; font-size: 0.82rem; color: var(--danger, #ef4444); border-color: var(--danger, #ef4444);" onclick="cancelActiveBooking('${upcoming.booking_id}')">
            <i class="fas fa-times"></i> Cancel
          </button>
        </div>
      `;
      bookingBox.appendChild(card);
    });
  } else {
    bookingBox.innerHTML = `
      <div class="crowd-recommendation" style="border-style: dashed; text-align: center; padding: 1.5rem; background: var(--bg-tertiary, #f8fafc);">
        <i class="fas fa-calendar-check fa-2x" style="color: var(--primary); margin-bottom: 0.5rem;"></i>
        <p style="font-weight: 600; margin-bottom: 0.25rem;">No Pending Unchecked-in Slots</p>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0;">You have no active pending bookings. All previous slots have been checked in or completed. Click "Book New Ration Slot" below to schedule an appointment.</p>
      </div>
    `;
  }

  // Booking history table
  const histTbody = document.getElementById('ben-history-tbody');
  histTbody.innerHTML = '';
  if (uniqueBookings.length === 0) {
    histTbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted);">No booking history found.</td></tr>`;
  } else {
    uniqueBookings.forEach(b => {
      const isBooked = b.status === 'BOOKED';
      const isMissed = b.status === 'MISSED';
      const isNotCheckedIn = isBooked || isMissed;
      
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="font-weight: 600; font-family: monospace;">${b.booking_id}</td>
        <td>${b.booking_date}</td>
        <td>${b.time_slot}</td>
        <td><span class="badge status-${b.status.toLowerCase()}">${b.status}</span></td>
        <td>
          <div style="display: flex; gap: 0.35rem; align-items: center;">
            <button class="control-btn" style="padding: 0.25rem 0.55rem;" title="View QR Receipt" onclick="openReceiptModal('${b.booking_id}', '${data.profile.q_ration_number}', '${b.booking_date}', '${b.time_slot}', '${b.shop_name}')">
              <i class="fas fa-receipt"></i>
            </button>
            ${isNotCheckedIn ? `
              <button class="control-btn" style="padding: 0.25rem 0.55rem; background-color: #f59e0b; color: white; border-color: #f59e0b;" title="Reschedule Slot" onclick="initRescheduling('${b.booking_id}')">
                <i class="fas fa-calendar-alt"></i>
              </button>
              <button class="control-btn" style="padding: 0.25rem 0.55rem;" title="Cancel Booking" onclick="cancelActiveBooking('${b.booking_id}')">
                <i class="fas fa-trash text-danger"></i>
              </button>
            ` : ''}
          </div>
        </td>
      `;
      histTbody.appendChild(tr);
    });
  }

  // Handle display of Reschedule button beside the Book Slot button
  const missedGlobal = data.bookings.find(b => b.status === 'MISSED');
  const reschedBtn = document.getElementById('open-reschedule-btn');
  if (missedGlobal) {
    reschedBtn.style.display = 'block';
    reschedBtn.onclick = () => initRescheduling(missedGlobal.booking_id);
  } else {
    reschedBtn.style.display = 'none';
  }

  if (typeof updateTranslations === 'function') {
    updateTranslations(state.lang);
  }
}

// Mark notifications read
document.getElementById('notification-bell-btn').addEventListener('click', (e) => {
  e.stopPropagation();
  const panel = document.getElementById('notification-panel');
  const isVisible = panel.style.display === "flex";
  panel.style.display = isVisible ? "none" : "flex";
  
  if (!isVisible && state.token) {
    // Mark as read in background
    fetch(`${API_BASE}/api/notifications/mark-read`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${state.token}` }
    }).then(() => {
      document.getElementById('notification-badge').style.display = "none";
    }).catch(err => console.log(err));
  }
});

// Close panel on clicking elsewhere
document.addEventListener('click', () => {
  document.getElementById('notification-panel').style.display = "none";
});

// ==========================================
// SLOT BOOKING ENGINE DIALOG
// ==========================================

document.getElementById('open-booking-modal-btn').addEventListener('click', () => {
  state.bookingRescheduleTargetId = null;
  openBookingModal();
});

function formatLocalDate(d) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function openBookingModal() {
  const isReschedule = Boolean(state.bookingRescheduleTargetId);
  document.getElementById('booking-modal-title').innerHTML = isReschedule 
    ? `<i class="fas fa-calendar-check"></i> Reschedule Slot: ${state.bookingRescheduleTargetId}`
    : `<i class="fas fa-calendar-plus"></i> Select Date & Time Slot`;
    
  const submitBtn = document.getElementById('confirm-booking-submit-btn');
  if (submitBtn) {
    submitBtn.innerHTML = isReschedule 
      ? `<i class="fas fa-calendar-check"></i> Confirm Reschedule` 
      : `<i class="fas fa-calendar-plus"></i> Confirm Booking`;
  }
    
  // Clear modal selections
  state.bookingSelectedDate = null;
  state.bookingSelectedSlotId = null;
  state.bookingSelectedSlotTime = null;
  
  const crowdIndicator = document.getElementById('modal-crowd-indicator');
  if (crowdIndicator) crowdIndicator.style.display = 'none';

  // Render date grid (Next 7 days starting today)
  const dateGrid = document.getElementById('modal-date-grid');
  dateGrid.innerHTML = '';
  
  const today = new Date();
  let firstDateStr = null;
  let firstCard = null;

  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(today.getDate() + i);
    const dateStr = formatLocalDate(d);
    
    // Formatting day name & date
    const dayName = d.toLocaleDateString(state.lang, { weekday: 'short' });
    const dayNumber = d.getDate();
    
    const card = document.createElement('div');
    card.className = 'date-card';
    card.setAttribute('data-date', dateStr);
    card.innerHTML = `
      <p class="day-name">${dayName}</p>
      <p class="day-number">${dayNumber}</p>
    `;
    
    card.addEventListener('click', () => {
      document.querySelectorAll('#modal-date-grid .date-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      state.bookingSelectedDate = dateStr;
      state.bookingSelectedSlotId = null;
      state.bookingSelectedSlotTime = null;
      if (crowdIndicator) crowdIndicator.style.display = 'none';
      loadSlotsForDate(dateStr);
    });
    
    dateGrid.appendChild(card);

    if (i === 0) {
      firstCard = card;
      firstDateStr = dateStr;
    }
  }

  // Pre-select the first date (Today) and load its time slots immediately
  if (firstCard && firstDateStr) {
    firstCard.classList.add('selected');
    state.bookingSelectedDate = firstDateStr;
    loadSlotsForDate(firstDateStr);
  }

  document.getElementById('booking-modal').style.display = "flex";
  document.body.style.overflow = "hidden";
}

async function loadSlotsForDate(dateStr) {
  const shopId = state.beneficiaryDashboard?.profile?.ration_shop_id 
              || state.user?.profile?.ration_shop_id 
              || 1;
              
  const grid = document.getElementById('modal-slots-grid');
  grid.innerHTML = '<div style="color: var(--text-muted); font-size: 0.85rem; padding: 0.75rem; grid-column: span 3; text-align: center;"><i class="fas fa-spinner fa-spin"></i> Loading available time slots...</div>';

  try {
    const res = await fetch(`${API_BASE}/api/beneficiary/slots?shopId=${shopId}&date=${dateStr}`, {
      headers: { 'Authorization': `Bearer ${state.token}` }
    });
    const slots = await res.json();
    if (!res.ok) throw new Error(slots.error || "Failed to load slots");

    const timeOrder = [
      "9:00 AM - 10:00 AM",
      "10:00 AM - 11:00 AM",
      "11:00 AM - 12:00 PM",
      "12:00 PM - 1:00 PM",
      "1:00 PM - 2:00 PM",
      "2:00 PM - 3:00 PM",
      "3:00 PM - 4:00 PM",
      "4:00 PM - 5:00 PM"
    ];
    
    slots.sort((a, b) => {
      let indexA = timeOrder.indexOf(a.time_slot);
      let indexB = timeOrder.indexOf(b.time_slot);
      if (indexA === -1) indexA = 999;
      if (indexB === -1) indexB = 999;
      return indexA - indexB;
    });

    grid.innerHTML = '';
    
    if (slots.length === 0) {
      grid.innerHTML = '<p style="color: var(--text-muted); font-size: 0.85rem; grid-column: span 3; text-align: center;">No slots available for this date.</p>';
      return;
    }

    const todayDate = new Date();
    const todayStr = formatLocalDate(todayDate);

    let firstAvailableCard = null;
    let firstAvailableSlot = null;

    slots.forEach(slot => {
      const card = document.createElement('div');
      let isPassed = false;

      if (dateStr === todayStr) {
        try {
          const endPart = slot.time_slot.split('-')[1].trim(); 
          const [time, period] = endPart.split(' '); 
          let [hours, mins] = time.split(':').map(Number);
          if (period === 'PM' && hours !== 12) hours += 12;
          if (period === 'AM' && hours === 12) hours = 0;
          
          const slotEnd = new Date();
          slotEnd.setHours(hours, mins, 0, 0);
          
          if (todayDate >= slotEnd) {
            isPassed = true;
          }
        } catch (e) {
          isPassed = false;
        }
      }

      const isFull = (slot.booked_count || 0) >= (slot.max_capacity || 10);
      const isDisabled = isFull || isPassed;
      card.className = `slot-card ${isDisabled ? 'disabled' : ''}`;
      
      let statusText = `${(slot.max_capacity || 10) - (slot.booked_count || 0)} slots left`;
      if (isPassed) {
        statusText = 'Time Passed';
      } else if (isFull) {
        statusText = 'Fully Booked';
      }

      card.innerHTML = `
        <div class="slot-time"><i class="far fa-clock"></i> ${slot.time_slot}</div>
        <div class="slot-capacity">${statusText}</div>
      `;

      if (!isDisabled) {
        if (!firstAvailableCard) {
          firstAvailableCard = card;
          firstAvailableSlot = slot;
        }

        card.addEventListener('click', () => {
          document.querySelectorAll('#modal-slots-grid .slot-card').forEach(c => c.classList.remove('selected'));
          card.classList.add('selected');
          state.bookingSelectedSlotId = slot.id;
          state.bookingSelectedSlotTime = slot.time_slot;
          updateCrowdEstimation(slot.booked_count || 0);
        });
      }

      grid.appendChild(card);
    });

    // Auto-select the earliest available slot for best user experience
    if (firstAvailableCard && firstAvailableSlot) {
      firstAvailableCard.classList.add('selected');
      state.bookingSelectedSlotId = firstAvailableSlot.id;
      state.bookingSelectedSlotTime = firstAvailableSlot.time_slot;
      updateCrowdEstimation(firstAvailableSlot.booked_count || 0);
    } else {
      // If all slots on this day are passed or booked, show an informative hint
      const notice = document.createElement('div');
      notice.style.gridColumn = 'span 3';
      notice.style.fontSize = '0.8rem';
      notice.style.color = 'var(--text-muted)';
      notice.style.textAlign = 'center';
      notice.style.marginTop = '0.5rem';
      notice.innerHTML = '<i class="fas fa-info-circle"></i> All slots for this date have passed or are fully booked. Please choose another date above.';
      grid.appendChild(notice);
    }
  } catch (err) {
    grid.innerHTML = `<p style="color: var(--danger, #ef4444); font-size: 0.85rem; grid-column: span 3; text-align: center;">Error fetching slots: ${err.message}</p>`;
  }

  if (typeof updateTranslations === 'function') {
    updateTranslations(state.lang);
  }
}

// Estimate crowd level based on booked count
function updateCrowdEstimation(bookedCount) {
  const fill = document.getElementById('modal-crowd-fill');
  const level = document.getElementById('modal-crowd-level');
  const waiting = document.getElementById('modal-crowd-waiting');
  const rec = document.getElementById('modal-crowd-rec');
  const indicator = document.getElementById('modal-crowd-indicator');
  
  if (!fill || !level || !waiting || !rec) return;

  fill.className = 'crowd-fill';
  
  if (bookedCount <= 3) {
    fill.classList.add('low');
    level.innerText = "LOW CROWD";
    waiting.innerText = "~2 mins waiting";
    rec.innerText = "Low crowd - suitable time to visit.";
    rec.style.borderColor = "#10b981";
  } else if (bookedCount <= 6) {
    fill.classList.add('medium');
    level.innerText = "MEDIUM CROWD";
    waiting.innerText = "~10 mins waiting";
    rec.innerText = "Moderate crowd - short queue expected.";
    rec.style.borderColor = "#f59e0b";
  } else {
    fill.classList.add('high');
    level.innerText = "HIGH CROWD";
    waiting.innerText = "~25 mins waiting";
    rec.innerText = "High crowd - consider booking another slot for quick service.";
    rec.style.borderColor = "#ef4444";
  }

  if (indicator) indicator.style.display = "block";
}

// Confirm booking/rescheduling submit
document.getElementById('confirm-booking-submit-btn').addEventListener('click', async () => {
  if (!state.bookingSelectedDate || !state.bookingSelectedSlotId) {
    return alert("Please select a date and time slot first.");
  }

  // Parse commodities automatically based on profile limits
  const commodities = [];
  const profile = state.beneficiaryDashboard.profile;
  const list = [
    { id: 1, quota: profile.rice_quota },
    { id: 2, quota: profile.wheat_quota },
    { id: 3, quota: profile.sugar_quota },
    { id: 4, quota: profile.gas_connection ? 0 : 5 }
  ];

  list.forEach(c => {
    if (c.quota > 0) {
      commodities.push({
        commodity_id: c.id,
        quantity: c.quota
      });
    }
  });

  if (commodities.length === 0) {
    return alert("No quota available to book.");
  }

  const shopId = state.beneficiaryDashboard.profile.ration_shop_id;

  try {
    let res, data;
    if (state.bookingRescheduleTargetId) {
      // Rescheduling Action
      res = await fetch(`${API_BASE}/api/beneficiary/reschedule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.token}`
        },
        body: JSON.stringify({
          bookingId: state.bookingRescheduleTargetId,
          newSlotId: state.bookingSelectedSlotId,
          newDate: state.bookingSelectedDate,
          newTimeSlot: state.bookingSelectedSlotTime
        })
      });
      data = await res.json();
    } else {
      // Normal Booking Action
      res = await fetch(`${API_BASE}/api/beneficiary/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.token}`
        },
        body: JSON.stringify({
          shopId,
          slotId: state.bookingSelectedSlotId,
          date: state.bookingSelectedDate,
          timeSlot: state.bookingSelectedSlotTime,
          commodities
        })
      });
      data = await res.json();
    }

    if (!res.ok) throw new Error(data.error || 'Operation failed.');

    const wasRescheduled = Boolean(state.bookingRescheduleTargetId);
    state.bookingRescheduleTargetId = null;

    alert(wasRescheduled ? "Slot rescheduled successfully!" : "Slot booked successfully!");
    
    // Close booking modal
    document.getElementById('booking-modal').style.display = "none";
    document.body.style.overflow = "";
    
    // Refresh dashboard
    fetchBeneficiaryDashboard();
    
    // Launch receipt modal automatically!
    const qRation = state.beneficiaryDashboard?.profile?.q_ration_number || state.user?.profile?.q_ration_number || '';
    const sName = state.beneficiaryDashboard?.profile?.shop_name || state.user?.profile?.shop_name || 'Designated PDS Shop';
    openReceiptModal(data.booking_id, qRation, data.date || state.bookingSelectedDate, data.time_slot || state.bookingSelectedSlotTime, sName);

  } catch (err) {
    alert("Booking Error: " + err.message);
  }
});

// Reschedule trigger from missed booking card or active slot card
function initRescheduling(bookingId) {
  state.bookingRescheduleTargetId = bookingId;
  openBookingModal();
}

// Cancel Booking trigger
async function cancelActiveBooking(bookingId) {
  if (!confirm("Are you sure you want to cancel this booking slot?")) return;
  try {
    const res = await fetch(`${API_BASE}/api/beneficiary/cancel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${state.token}`
      },
      body: JSON.stringify({ bookingId })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);

    alert("Booking cancelled successfully.");
    fetchBeneficiaryDashboard();
  } catch (err) {
    alert(err.message);
  }
}

// Modals close button handlers
document.getElementById('close-booking-modal').addEventListener('click', () => {
  document.getElementById('booking-modal').style.display = "none";
  document.body.style.overflow = "";
  state.bookingRescheduleTargetId = null;
});

// ==========================================
// RECEIPT GENERATION (QR CODE)
// ==========================================

function openReceiptModal(bookingId, rationNumber, date, timeSlot, shopName) {
  document.getElementById('receipt-booking-id').innerText = bookingId;
  document.getElementById('receipt-ration-number').innerText = rationNumber;
  document.getElementById('receipt-date').innerText = date;
  document.getElementById('receipt-timeslot').innerText = timeSlot;
  document.getElementById('receipt-shop-name').innerText = shopName;

  // Clear previous QR code
  const qrContainer = document.getElementById('receipt-qr-code');
  qrContainer.innerHTML = '';

  // Render QR Code using CDN library qrcode.js
  try {
    new QRCode(qrContainer, {
      text: `RATION-VERIFY:${bookingId}:${rationNumber}:${date}`,
      width: 160,
      height: 160,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H
    });
  } catch (e) {
    console.error("QR Code library error: ", e);
    qrContainer.innerText = `QR: RATION-VERIFY:${bookingId}`;
  }

  document.getElementById('receipt-modal').style.display = "flex";
}

document.getElementById('close-receipt-modal').addEventListener('click', () => {
  document.getElementById('receipt-modal').style.display = "none";
});

// ==========================================
// DEALER PORTAL LOGIC & QR scanner
// ==========================================

async function fetchDealerDashboard() {
  if (!state.token) return;
  try {
    const res = await fetch(`${API_BASE}/api/dealer/dashboard`, {
      headers: { 'Authorization': `Bearer ${state.token}` }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    
    state.dealerDashboard = data;
    renderDealerDashboard();
  } catch (err) {
    console.error(err.message);
  }
}

function renderDealerDashboard() {
  const data = state.dealerDashboard;
  if (!data) return;

  // Details
  document.getElementById('dealer-name-display').innerText = data.profile.name;
  document.getElementById('dealer-shop-code').innerText = data.profile.shop_code;
  document.getElementById('dealer-shop-name').innerText = data.profile.shop_name;

  // Stats KPIs
  document.getElementById('dealer-kpi-booked').innerText = data.stats.totalBooked;
  document.getElementById('dealer-kpi-completed').innerText = data.stats.completed;
  document.getElementById('dealer-kpi-pending').innerText = data.stats.pending;
  document.getElementById('dealer-kpi-missed').innerText = data.stats.missed;

  // Populate Today's Registry Table
  renderDealerQueueRegistry(data.todayBookings);

  // Assisted booking time slot choices
  const tsSelect = document.getElementById('assisted-timeslot');
  tsSelect.innerHTML = '';
  const timeSlots = [
    "9:00 AM - 10:00 AM", "10:00 AM - 11:00 AM", "11:00 AM - 12:00 PM",
    "12:00 PM - 1:00 PM", "1:00 PM - 2:00 PM", "2:00 PM - 3:00 PM",
    "3:00 PM - 4:00 PM", "4:00 PM - 5:00 PM"
  ];
  timeSlots.forEach(ts => {
    const opt = document.createElement('option');
    opt.value = ts;
    opt.innerText = ts;
    tsSelect.appendChild(opt);
  });

  // Render Chart.js
  renderDealerDistributionCharts(data);
}

function renderDealerQueueRegistry(bookings) {
  const tbody = document.getElementById('dealer-queue-tbody');
  tbody.innerHTML = '';

  const searchQuery = document.getElementById('dealer-search-queue').value.toLowerCase();
  const statusFilter = document.getElementById('dealer-filter-status').value;

  // Deduplicate bookings by booking_id to prevent duplicates
  const seenIds = new Set();
  const uniqueList = [];
  (bookings || []).forEach(b => {
    if (!seenIds.has(b.booking_id) && b.status !== 'RESCHEDULED' && b.status !== 'CANCELLED') {
      seenIds.add(b.booking_id);
      uniqueList.push(b);
    }
  });

  const filtered = uniqueList.filter(b => {
    const matchesSearch = b.booking_id.toLowerCase().includes(searchQuery) ||
                          b.beneficiary_name.toLowerCase().includes(searchQuery) ||
                          b.q_ration_number.toLowerCase().includes(searchQuery);
    
    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted);">No matching bookings registered.</td></tr>`;
    return;
  }

  filtered.forEach(b => {
    const isCheckedIn = b.status === 'CHECKED_IN';
    const tr = document.createElement('tr');
    
    tr.innerHTML = `
      <td style="font-weight: 600; font-family: monospace;">${b.booking_id}</td>
      <td>${b.booking_date}</td>
      <td style="font-weight: bold;">${b.q_ration_number}</td>
      <td>${b.beneficiary_name}</td>
      <td>${b.time_slot}</td>
      <td><span class="badge status-${b.status.toLowerCase()}">${b.status}</span></td>
      <td>
        <div style="display: flex; gap: 0.3rem;">
          ${isCheckedIn ? `
            <button class="btn-primary" style="padding: 0.25rem 0.5rem; font-size: 0.75rem; width: auto;" onclick="openDistributionPanel('${b.booking_id}')">
              <i class="fas fa-dolly"></i> Distribute
            </button>
          ` : ''}
          ${b.status === 'BOOKED' ? `
            <button class="btn-secondary" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;" onclick="checkInDealerDirect('${b.booking_id}')">
              Check-In
            </button>
          ` : ''}
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });

  if (typeof updateTranslations === 'function') {
    updateTranslations(state.lang);
  }
}

// Search and Filter today's queue listeners
document.getElementById('dealer-search-queue').addEventListener('input', () => {
  if (state.dealerDashboard) renderDealerQueueRegistry(state.dealerDashboard.todayBookings);
});
document.getElementById('dealer-filter-status').addEventListener('change', () => {
  if (state.dealerDashboard) renderDealerQueueRegistry(state.dealerDashboard.todayBookings);
});

// Direct Checkin button in table
async function checkInDealerDirect(bookingId) {
  try {
    const res = await fetch(`${API_BASE}/api/dealer/check-in`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${state.token}`
      },
      body: JSON.stringify({ bookingId })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);

    alert("Check-in successful!");
    fetchDealerDashboard();
    openDistributionPanel(bookingId);
  } catch (err) {
    alert(err.message);
  }
}

// QR Scanner logic via Html5Qrcode
let html5QrcodeScanner = null;

document.getElementById('start-qr-scanner-btn').addEventListener('click', () => {
  document.getElementById('qr-scanner-view').style.display = "block";
  document.getElementById('qr-scanner-controls').style.display = "none";
  
  html5QrcodeScanner = new Html5Qrcode("qr-reader");
  
  html5QrcodeScanner.start(
    { facingMode: "environment" },
    {
      fps: 10,
      qrbox: { width: 250, height: 250 }
    },
    (decodedText) => {
      // Handle success QR read
      html5QrcodeScanner.stop().then(() => {
        document.getElementById('qr-scanner-view').style.display = "none";
        document.getElementById('qr-scanner-controls').style.display = "block";
        processQRText(decodedText);
      });
    },
    (errorMessage) => {
      // silent scan fail logs
    }
  ).catch(err => {
    alert("Camera initialization failed. Please use manual verify entry for testing.");
    document.getElementById('qr-scanner-view').style.display = "none";
    document.getElementById('qr-scanner-controls').style.display = "block";
  });
});

document.getElementById('stop-qr-scanner-btn').addEventListener('click', () => {
  if (html5QrcodeScanner) {
    html5QrcodeScanner.stop().then(() => {
      document.getElementById('qr-scanner-view').style.display = "none";
      document.getElementById('qr-scanner-controls').style.display = "block";
    });
  }
});

// Manual QR Verify Bypass
document.getElementById('manual-checkin-btn').addEventListener('click', () => {
  const idInput = document.getElementById('manual-booking-id-check').value.trim();
  if (!idInput) return alert("Please enter booking ID.");
  processQRText(`RATION-VERIFY:${idInput}:MOCK:MOCK`);
});

async function processQRText(qrText) {
  // Parse QR e.g. RATION-VERIFY:B-123456:1:2026-08-30
  const parts = qrText.split(':');
  if (parts[0] !== 'RATION-VERIFY') {
    alert("INVALID QR: Smart PDS signature mismatch.");
    return;
  }
  
  const bookingId = parts[1];
  const resBox = document.getElementById('checkin-result-box');
  resBox.style.display = "block";
  resBox.innerHTML = `<span style="color: var(--text-primary); font-weight: bold;"><i class="fas fa-spinner fa-spin"></i> Verifying...</span>`;

  try {
    const res = await fetch(`${API_BASE}/api/dealer/check-in`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${state.token}`
      },
      body: JSON.stringify({ bookingId })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);

    resBox.innerHTML = `<span style="color: var(--status-completed-text); font-weight: bold;"><i class="fas fa-check-double"></i> CHECK-IN SUCCESSFUL! EXPEDITED PROCESSING ACTIVATED.</span>`;
    fetchDealerDashboard();
    
    // Automatically launch Distribution Panel!
    openDistributionPanel(bookingId);
  } catch (err) {
    resBox.innerHTML = `<span style="color: var(--status-missed-text); font-weight: bold;"><i class="fas fa-times-circle"></i> CHECK-IN FAILED: ${err.message}</span>`;
  }
}

// Open Distribution recording panel
function openDistributionPanel(bookingId) {
  const data = state.dealerDashboard;
  if (!data) return;

  const b = data.todayBookings.find(x => x.booking_id === bookingId);
  if (!b) return alert("Booking details not cached. Refreshing...");

  document.getElementById('dist-ben-name').innerText = b.beneficiary_name;
  document.getElementById('dist-ben-ration').innerText = b.q_ration_number;
  document.getElementById('dist-ben-card').innerText = b.commodities[0] ? 'PHH' : 'PHH'; // fallback
  document.getElementById('dist-booking-id').innerText = b.booking_id;

  // Render quantities table
  const tbody = document.getElementById('distribution-commodities-tbody');
  tbody.innerHTML = '';

  b.commodities.forEach(c => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="font-weight: 500;">${c.name}</td>
      <td style="font-weight: 600;">${c.requested_quantity} ${c.unit}</td>
      <td>
        <input type="number" class="form-control dist-input" style="width: 100px; padding: 0.35rem;" data-id="${c.commodity_id}" max="${c.requested_quantity}" min="0" step="0.1" value="${c.requested_quantity}">
      </td>
    `;
    tbody.appendChild(tr);
  });

  document.getElementById('distribution-panel').style.display = "block";
  document.getElementById('distribution-panel').scrollIntoView({ behavior: 'smooth' });
}

document.getElementById('close-distribution-btn').addEventListener('click', () => {
  document.getElementById('distribution-panel').style.display = "none";
});

// Distribute form submit
document.getElementById('distribution-submit-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const bookingId = document.getElementById('dist-booking-id').innerText;
  
  const commodities = [];
  document.querySelectorAll('.dist-input').forEach(input => {
    commodities.push({
      commodity_id: parseInt(input.getAttribute('data-id')),
      distributed_quantity: parseFloat(input.value)
    });
  });

  try {
    const res = await fetch(`${API_BASE}/api/dealer/distribute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${state.token}`
      },
      body: JSON.stringify({ bookingId, commodities })
    });
    
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);

    alert("RATION DISTRIBUTION RECORDED successfully! Stock levels updated.");
    document.getElementById('distribution-panel').style.display = "none";
    fetchDealerDashboard();
  } catch (err) {
    alert("Distribution Error: " + err.message);
  }
});

// Dealer Assisted Booking verifying beneficiary
document.getElementById('assisted-verify-btn').addEventListener('click', async () => {
  const rat = document.getElementById('assisted-ration').value.trim();
  if (!rat) return alert("Please enter Ration Number.");

  try {
    const res = await fetch(`${API_BASE}/api/dealer/verify-beneficiary?rationNumber=${rat}`, {
      headers: { 'Authorization': `Bearer ${state.token}` }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);

    document.getElementById('assisted-name').value = data.name;
    document.getElementById('assisted-form-details').style.display = "block";
    
    // Set min date of booking to today, max date to 7 days out
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('assisted-date').min = today;
  } catch (err) {
    alert("Verification failed: " + err.message);
  }
});

document.getElementById('assisted-booking-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const qRationNumber = document.getElementById('assisted-ration').value.trim();
  const date = document.getElementById('assisted-date').value;
  const timeSlot = document.getElementById('assisted-timeslot').value;

  try {
    // 1. Fetch available slots first to lock in one ID
    const shopId = state.dealerDashboard.profile.ration_shop_id;
    const slotsRes = await fetch(`${API_BASE}/api/beneficiary/slots?shopId=${shopId}&date=${date}`, {
      headers: { 'Authorization': `Bearer ${state.token}` }
    });
    const slots = await slotsRes.json();
    const slotObj = slots.find(s => s.time_slot === timeSlot);
    if (!slotObj) throw new Error("Selected slot time is full or inactive on the chosen date.");

    // 2. Submit Assisted booking
    const res = await fetch(`${API_BASE}/api/dealer/assisted-booking`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${state.token}`
      },
      body: JSON.stringify({
        qRationNumber,
        slotId: slotObj.id,
        date,
        timeSlot,
        commodities: [
          { commodity_id: 1, quantity: 6.0 }, // default assisted quantities
          { commodity_id: 2, quantity: 1.0 }
        ]
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);

    alert(`Booking created successfully for beneficiary ${data.beneficiary_name}!`);
    document.getElementById('assisted-booking-form').reset();
    document.getElementById('assisted-form-details').style.display = "none";
    
    fetchDealerDashboard();
    
    // Open receipt for printing
    openReceiptModal(data.booking_id, qRationNumber, data.date, data.time_slot, state.dealerDashboard.profile.shop_name);
  } catch (err) {
    alert("Assisted Booking Error: " + err.message);
  }
});

// Stock intake submission
document.getElementById('stock-intake-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const commSelect = document.getElementById('stock-commodity');
  const commodityId = commSelect.value;
  const commName = commSelect.options[commSelect.selectedIndex].text;
  const quantity = parseFloat(document.getElementById('stock-quantity').value);
  const referenceId = document.getElementById('stock-ref').value.trim();
  const submitBtn = document.getElementById('stock-submit-btn');
  const feedback = document.getElementById('stock-intake-feedback');
  const lastIntakeBadge = document.getElementById('dealer-last-intake-info');

  if (isNaN(quantity) || quantity <= 0) {
    alert("Please enter a valid quantity greater than 0.");
    return;
  }

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Recording Intake...';
  }

  try {
    const res = await fetch(`${API_BASE}/api/dealer/add-stock`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${state.token}`
      },
      body: JSON.stringify({ commodityId, quantity, referenceId })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);

    // Reset input fields
    document.getElementById('stock-quantity').value = '';
    document.getElementById('stock-ref').value = '';

    // Show inline success message
    if (feedback) {
      feedback.style.display = 'block';
      feedback.innerHTML = `
        <div style="padding: 0.6rem 0.8rem; background: rgba(16, 185, 129, 0.12); border: 1px solid #10b981; border-radius: 8px; color: #065f46; font-size: 0.85rem; font-weight: 500;">
          <i class="fas fa-circle-check" style="color: #10b981;"></i> 
          Recorded intake of <strong>+${quantity} ${commName}</strong> (Ref: <code>${referenceId}</code>). Graph updated!
        </div>
      `;
      setTimeout(() => { if (feedback) feedback.style.display = 'none'; }, 6000);
    }

    // Update live badge in chart card
    if (lastIntakeBadge) {
      lastIntakeBadge.style.display = 'block';
      lastIntakeBadge.innerHTML = `<i class="fas fa-arrow-trend-up"></i> Last Intake: <strong>+${quantity} ${commName}</strong> (Ref: <code>${referenceId}</code>) recorded live!`;
    }

    // Refresh dealer dashboard and smoothly animate the graph
    await fetchDealerDashboard();

  } catch (err) {
    if (feedback) {
      feedback.style.display = 'block';
      feedback.innerHTML = `
        <div style="padding: 0.6rem 0.8rem; background: rgba(239, 68, 68, 0.12); border: 1px solid #ef4444; border-radius: 8px; color: #991b1b; font-size: 0.85rem;">
          <i class="fas fa-triangle-exclamation" style="color: #ef4444;"></i> Error: ${err.message}
        </div>
      `;
    } else {
      alert("Stock Intake Error: " + err.message);
    }
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Record Stock Intake';
    }
  }
});

// Chart.js rendering for Dealer with real-time Stock Intake
function renderDealerDistributionCharts(data) {
  const canvas = document.getElementById('dealerChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const commodities = (data.stockStatus || []).map(s => `${s.commodity_name} (${s.unit || 'kg'})`);
  const intake = (data.stockStatus || []).map(s => parseFloat(s.allocated_quantity) || 0);
  const remaining = (data.stockStatus || []).map(s => parseFloat(s.remaining_quantity) || 0);
  const distributed = (data.stockStatus || []).map(s => parseFloat(s.distributed_quantity) || 0);

  // If chart instance already exists, update data with smooth animation
  if (state.dealerChart && state.dealerChart.ctx) {
    state.dealerChart.data.labels = commodities;
    state.dealerChart.data.datasets[0].data = intake;
    state.dealerChart.data.datasets[1].data = remaining;
    state.dealerChart.data.datasets[2].data = distributed;
    state.dealerChart.update('active');
    return;
  }

  // If a stray Chart.js instance is attached to this canvas, destroy it first to avoid "Canvas is already in use"
  if (typeof Chart !== 'undefined' && Chart.getChart) {
    const existing = Chart.getChart(canvas);
    if (existing) existing.destroy();
  }

  state.dealerChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: commodities,
      datasets: [
        {
          label: 'Stock Intake (Total Received)',
          data: intake,
          backgroundColor: 'rgba(139, 92, 246, 0.85)',
          borderColor: '#7c3aed',
          borderWidth: 1.5,
          borderRadius: 6
        },
        {
          label: 'Remaining Stock (Available)',
          data: remaining,
          backgroundColor: 'rgba(59, 130, 246, 0.85)',
          borderColor: '#2563eb',
          borderWidth: 1.5,
          borderRadius: 6
        },
        {
          label: 'Distributed Stock (Issued)',
          data: distributed,
          backgroundColor: 'rgba(16, 185, 129, 0.85)',
          borderColor: '#059669',
          borderWidth: 1.5,
          borderRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 750,
        easing: 'easeOutQuart'
      },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            boxWidth: 14,
            font: { size: 12, weight: '600' }
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.dataset.label}: ${Number(context.raw).toLocaleString()} kg`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(0, 0, 0, 0.05)' }
        },
        x: {
          grid: { display: false }
        }
      }
    }
  });
}

// ==========================================
// GOVERNMENT ADMIN PORTAL LOGIC & FILTERS
// ==========================================

async function fetchAdminDashboard() {
  if (!state.token) return;
  
  // Build query string filters
  const stateVal = document.getElementById('admin-state-filter').value;
  const distVal = document.getElementById('admin-district-filter').value;
  const mandalVal = document.getElementById('admin-mandal-filter').value;
  
  let q = `?v=1`;
  if (stateVal !== 'ALL') q += `&state=${stateVal}`;
  if (distVal !== 'ALL') q += `&district=${distVal}`;
  if (mandalVal !== 'ALL') q += `&mandal=${mandalVal}`;

  try {
    const res = await fetch(`${API_BASE}/api/admin/dashboard${q}`, {
      headers: { 'Authorization': `Bearer ${state.token}` }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);

    state.adminDashboard = data;
    renderAdminDashboard();
  } catch (err) {
    console.error(err.message);
  }
}

function renderAdminDashboard() {
  const data = state.adminDashboard;
  if (!data) return;

  const metrics = data.metrics;
  
  // KPIs
  document.getElementById('admin-kpi-shops').innerText = metrics.summary.shops;
  document.getElementById('admin-kpi-beneficiaries').innerText = metrics.summary.beneficiaries;
  document.getElementById('admin-kpi-bookings').innerText = metrics.summary.bookings.total;
  document.getElementById('admin-kpi-completed').innerText = metrics.summary.bookings.completed || 0;



  // Load shops table list
  const shopsTbody = document.getElementById('admin-shops-tbody');
  shopsTbody.innerHTML = '';
  data.shops.forEach(s => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="font-weight: 600;">${s.shop_name}</td>
      <td style="font-family: monospace;">${s.shop_code}</td>
      <td>${s.mandal}, ${s.district}</td>
      <td>
        <div style="display: flex; gap: 0.3rem;">
          <button class="control-btn" style="padding: 0.2rem 0.4rem;" onclick="editRationShopModal(${s.id}, '${s.shop_name}', '${s.shop_code}', '${s.address}', '${s.contact_number}')"><i class="fas fa-edit"></i></button>
          <button class="control-btn" style="padding: 0.2rem 0.4rem;" onclick="deleteRationShopConfirm(${s.id})"><i class="fas fa-trash text-danger"></i></button>
        </div>
      </td>
    `;
    shopsTbody.appendChild(tr);
  });

  // Alerts feed
  const alertsList = document.getElementById('admin-alerts-list');
  alertsList.innerHTML = '';
  metrics.alerts.forEach(alertItem => {
    const item = document.createElement('div');
    item.className = 'crowd-recommendation';
    item.style.borderColor = alertItem.severity === 'HIGH' ? '#ef4444' : '#f59e0b';
    item.style.backgroundColor = alertItem.severity === 'HIGH' ? 'rgba(239, 68, 68, 0.05)' : 'rgba(245, 158, 11, 0.05)';
    item.innerHTML = `
      <p style="font-weight: 700; color: ${alertItem.severity === 'HIGH' ? '#ef4444' : '#b45309'}; font-size: 0.8rem;">
        <i class="fas fa-triangle-exclamation"></i> ${alertItem.type} [${alertItem.shop}]
      </p>
      <p style="font-size: 0.75rem; margin-top: 0.25rem;">${alertItem.details}</p>
    `;
    alertsList.appendChild(item);
  });

  // Audit Logs table
  const auditTbody = document.getElementById('admin-audit-tbody');
  auditTbody.innerHTML = '';
  data.auditLogs.forEach(log => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="font-size: 0.75rem; color: var(--text-muted);">${new Date(log.created_at).toLocaleString()}</td>
      <td style="font-weight: bold; font-size: 0.8rem;">${log.action}</td>
      <td><span class="ration-badge" style="margin:0;">${log.user_role}</span></td>
      <td style="font-size: 0.8rem;">${log.details}</td>
    `;
    auditTbody.appendChild(tr);
  });

  // Render interactive admin monitoring charts
  renderAdminAnalyticsCharts(metrics);

  if (typeof updateTranslations === 'function') {
    updateTranslations(state.lang);
  }
}



// Admin CRUD functions
function editRationShopModal(id, name, code, address, contact) {
  document.getElementById('shop-modal-title').innerText = "Edit Ration Shop";
  document.getElementById('shop-form-id').value = id;
  document.getElementById('shop-form-name').value = name;
  document.getElementById('shop-form-code').value = code;
  document.getElementById('shop-form-code').disabled = true; // prevent changing code
  document.getElementById('shop-form-address').value = address;
  document.getElementById('shop-form-contact').value = contact;
  document.getElementById('shop-modal').style.display = "flex";
}

document.getElementById('admin-add-shop-btn').addEventListener('click', () => {
  document.getElementById('shop-modal-title').innerText = "Add Ration Shop";
  document.getElementById('shop-form-id').value = '';
  document.getElementById('shop-form-name').value = '';
  document.getElementById('shop-form-code').value = '';
  document.getElementById('shop-form-code').disabled = false;
  document.getElementById('shop-form-address').value = '';
  document.getElementById('shop-form-contact').value = '';
  document.getElementById('shop-modal').style.display = "flex";
});

document.getElementById('close-shop-modal').addEventListener('click', () => {
  document.getElementById('shop-modal').style.display = "none";
});

document.getElementById('admin-shop-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('shop-form-id').value;
  const shopName = document.getElementById('shop-form-name').value.trim();
  const shopCode = document.getElementById('shop-form-code').value.trim();
  const locationId = document.getElementById('shop-form-location').value;
  const address = document.getElementById('shop-form-address').value.trim();
  const contact = document.getElementById('shop-form-contact').value.trim();

  try {
    let res;
    if (id) {
      // Edit
      res = await fetch(`${API_BASE}/api/admin/shops/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.token}`
        },
        body: JSON.stringify({ shopName, address, contact })
      });
    } else {
      // Add
      res = await fetch(`${API_BASE}/api/admin/shops`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.token}`
        },
        body: JSON.stringify({ shopName, shopCode, locationId, address, contact })
      });
    }

    const data = await res.json();
    if (!res.ok) throw new Error(data.error);

    alert("Ration Shop saved successfully.");
    document.getElementById('shop-modal').style.display = "none";
    fetchAdminDashboard();
  } catch (err) {
    alert("Error: " + err.message);
  }
});

async function deleteRationShopConfirm(id) {
  if (!confirm("Are you sure you want to deactivate/delete this ration shop? All associated stock and booking records will be removed.")) return;
  try {
    const res = await fetch(`${API_BASE}/api/admin/shops/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${state.token}` }
    });
    if (!res.ok) throw new Error("Delete failed.");
    alert("Shop deleted.");
    fetchAdminDashboard();
  } catch (err) {
    alert(err.message);
  }
}

// Chart.js admin rendering
function renderAdminAnalyticsCharts(metrics) {
  // Supply vs Distribution Chart
  const ctxSupply = document.getElementById('adminSupplyChart').getContext('2d');
  if (state.adminSupplyChart) state.adminSupplyChart.destroy();

  const commodities = metrics.stock.map(s => s.commodity);
  const supplied = metrics.stock.map(s => s.supplied);
  const distributed = metrics.stock.map(s => s.distributed);

  state.adminSupplyChart = new Chart(ctxSupply, {
    type: 'bar',
    data: {
      labels: commodities,
      datasets: [
        {
          label: 'Total Supplied to Shops',
          data: supplied,
          backgroundColor: '#3b82f6',
          borderRadius: 4
        },
        {
          label: 'Distributed to Citizens',
          data: distributed,
          backgroundColor: '#10b981',
          borderRadius: 4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });

  // Completed vs Missed Bookings Doughnut
  const ctxCompletion = document.getElementById('adminCompletionChart').getContext('2d');
  if (state.adminCompletionChart) state.adminCompletionChart.destroy();

  const total = metrics.bookings.total;
  const completed = metrics.bookings.completed || 0;
  const missed = metrics.bookings.missed || 0;
  const pending = metrics.bookings.pending || 0;
  const rescheduled = metrics.bookings.rescheduled || 0;
  const cancelled = metrics.bookings.cancelled || 0;

  state.adminCompletionChart = new Chart(ctxCompletion, {
    type: 'doughnut',
    data: {
      labels: ['Completed', 'Missed', 'Pending', 'Rescheduled', 'Cancelled'],
      datasets: [{
        data: [completed, missed, pending, rescheduled, cancelled],
        backgroundColor: ['#10b981', '#ef4444', '#f59e0b', '#a21caf', '#64748b']
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'right' }
      }
    }
  });
}

// Export Audit Logs (simulated)
document.getElementById('admin-export-audit-btn').addEventListener('click', () => {
  alert("Export Status: Audit logs exported successfully in Excel/PDF format to local download folder (ration_audit_logs_2026.xlsx).");
});

// ==========================================
// REAL-TIME AI ASSISTANT (PDS SAHAYAK)
// Fully managed by shared frontend/chatbot.js
// ==========================================

// ==========================================
// SYSTEM ROUTING & VIEWS HUB
// ==========================================

function showPortalDashboard() {
  if (!state.token || !state.user) {
    showAuthSection();
    return;
  }

  // Hide Auth section
  const authSec = document.getElementById('auth-section');
  if (authSec) authSec.style.display = "none";

  document.getElementById('logout-btn').style.display = "flex";

  const role = state.user.role;
  document.getElementById('beneficiary-dashboard').style.display = "none";
  document.getElementById('dealer-dashboard').style.display = "none";
  document.getElementById('admin-dashboard').style.display = "none";

  if (role === 'beneficiary') {
    document.getElementById('beneficiary-dashboard').style.display = "grid";
    fetchBeneficiaryDashboard();
  } else if (role === 'dealer') {
    document.getElementById('dealer-dashboard').style.display = "grid";
    fetchDealerDashboard();
  } else if (role === 'admin') {
    document.getElementById('admin-dashboard').style.display = "grid";
    fetchAdminDashboard();
  }
}

function showAuthSection(role) {
  // Hide all dashboards
  document.getElementById('beneficiary-dashboard').style.display = "none";
  document.getElementById('dealer-dashboard').style.display = "none";
  document.getElementById('admin-dashboard').style.display = "none";
  document.getElementById('logout-btn').style.display = "none";

  // Show Auth section
  const authSec = document.getElementById('auth-section');
  if (authSec) authSec.style.display = "block";

  switchAuthPortal(role || state.activeRole || 'beneficiary');
}

// Portal Role Configurations
const portalConfigs = {
  beneficiary: {
    roleName: 'beneficiary',
    badgeClass: 'citizen',
    badgeIcon: 'fa-users',
    badgeText: 'Public Distribution Beneficiary',
    title: 'Citizen Login',
    subtitle: 'Enter your Ration Card Number and Password to access your ration booking services.',
    userLabel: '<i class="fas fa-id-card"></i> Ration Card Number',
    userPlaceholder: 'e.g. RATION999 or 12-digit number',
    submitText: 'Sign In to Citizen Portal',
    wrapperClass: 'portal-citizen',
    showRegisterPrompt: true, // Registration allowed for Citizen
    showNotice: false,
    showDemoCreds: false, // Strictly removed from Citizen/User login page only
    demoUsername: 'RATION999',
    demoPassword: 'password'
  },
  dealer: {
    roleName: 'dealer',
    badgeClass: 'dealer',
    badgeIcon: 'fa-store',
    badgeText: 'Fair Price Shop Portal',
    title: 'FPS Dealer Login',
    subtitle: 'Authorized Fair Price Shop Dealers access for queue check-in & ration distribution.',
    userLabel: '<i class="fas fa-store-alt"></i> Dealer ID / Shop Code',
    userPlaceholder: 'e.g. DEALER101',
    submitText: 'Sign In to Dealer Portal',
    wrapperClass: 'portal-dealer',
    showRegisterPrompt: false, // NO registration for Dealer
    showNotice: true,
    noticeTitle: 'Authorized FPS Dealers Only',
    noticeText: 'Dealer accounts are provisioned and audited by the District Civil Supplies Office. Public registration is not permitted.',
    showDemoCreds: false, // Strictly removed from Dealer login page only
    demoUsername: 'DEALER101',
    demoPassword: 'password'
  },
  admin: {
    roleName: 'admin',
    badgeClass: 'government',
    badgeIcon: 'fa-landmark',
    badgeText: 'Civil Supplies Department Portal',
    title: 'Government Administration Login',
    subtitle: 'State & District Civil Supplies Officers portal for allocation, supply chains & oversight.',
    userLabel: '<i class="fas fa-user-shield"></i> Government Admin ID / Officer Code',
    userPlaceholder: 'e.g. ADMIN001',
    submitText: 'Sign In to Government Portal',
    wrapperClass: 'portal-government',
    showRegisterPrompt: false, // NO registration for Government
    showNotice: true,
    noticeTitle: 'Restricted Government System',
    noticeText: 'Access is restricted to authorized Food & Civil Supplies Department officers. All login activities are monitored.',
    showDemoCreds: false, // Strictly removed from Government login page only
    demoUsername: 'ADMIN001',
    demoPassword: 'password'
  }
};

function switchAuthPortal(role) {
  const validRole = (role && portalConfigs[role]) ? role : 'beneficiary';
  state.activeRole = validRole;
  const config = portalConfigs[validRole];

  // Strictly isolate login page: REMOVE other login buttons and show ONLY current portal
  const citizenTab = document.getElementById('tab-role-beneficiary');
  const dealerTab = document.getElementById('tab-role-dealer');
  const adminTab = document.getElementById('tab-role-admin');

  if (citizenTab) {
    citizenTab.style.display = (validRole === 'beneficiary') ? 'inline-flex' : 'none';
    if (validRole === 'beneficiary') citizenTab.classList.add('active');
  }
  if (dealerTab) {
    dealerTab.style.display = (validRole === 'dealer') ? 'inline-flex' : 'none';
    if (validRole === 'dealer') dealerTab.classList.add('active');
  }
  if (adminTab) {
    adminTab.style.display = (validRole === 'admin') ? 'inline-flex' : 'none';
    if (validRole === 'admin') adminTab.classList.add('active');
  }

  // Update Wrapper Styling
  const wrapper = document.getElementById('auth-wrapper-box');
  if (wrapper) {
    wrapper.classList.remove('portal-citizen', 'portal-dealer', 'portal-government');
    wrapper.classList.add(config.wrapperClass);
  }

  // Update Dynamic Portal Badge & Header
  const badge = document.getElementById('auth-portal-badge');
  if (badge) {
    badge.className = `portal-badge ${config.badgeClass}`;
    badge.innerHTML = `<i class="fas ${config.badgeIcon}"></i> ${config.badgeText}`;
  }

  const title = document.getElementById('auth-title');
  if (title) title.innerText = config.title;

  const subtitle = document.getElementById('auth-subtitle');
  if (subtitle) subtitle.innerText = config.subtitle;

  const label = document.getElementById('username-label');
  if (label) label.innerHTML = config.userLabel;

  const usernameInput = document.getElementById('login-username');
  if (usernameInput) {
    usernameInput.placeholder = config.userPlaceholder;
    usernameInput.value = '';
  }

  const passInput = document.getElementById('login-password');
  if (passInput) passInput.value = '';

  const btnText = document.getElementById('login-btn-text');
  if (btnText) btnText.innerText = config.submitText;

  // Demo Pill - Strictly removed from User Login Page Only
  const demoBox = document.getElementById('demo-creds-box');
  const demoBtn = document.getElementById('demo-fill-btn');
  if (demoBox) {
    demoBox.style.display = config.showDemoCreds ? 'flex' : 'none';
  }
  if (demoBtn && config.showDemoCreds) {
    demoBtn.innerText = `${config.demoUsername} / ${config.demoPassword}`;
  }

  // Notice box for Dealer/Gov
  const noticeBox = document.getElementById('portal-notice-box');
  if (noticeBox) {
    if (config.showNotice) {
      noticeBox.style.display = 'block';
      noticeBox.innerHTML = `<strong><i class="fas fa-shield-alt"></i> ${config.noticeTitle}</strong><br>${config.noticeText}`;
    } else {
      noticeBox.style.display = 'none';
      noticeBox.innerHTML = '';
    }
  }

  // Registration prompt: Only visible for citizen/beneficiary
  const regPrompt = document.getElementById('register-footer-prompt');
  if (regPrompt) {
    regPrompt.style.display = config.showRegisterPrompt ? 'block' : 'none';
  }

  // Always reset to Login View (hide registration form if open)
  const loginBox = document.getElementById('login-form-container');
  const regBox = document.getElementById('register-form-container');
  if (loginBox) loginBox.style.display = 'block';
  if (regBox) regBox.style.display = 'none';

  // Hide alerts
  const alertBox = document.getElementById('auth-alert');
  if (alertBox) {
    alertBox.style.display = 'none';
    alertBox.innerText = '';
  }

  // Update browser URL query param without reload
  try {
    const currentUrl = new URL(window.location);
    currentUrl.searchParams.set('role', validRole);
    window.history.replaceState({}, '', currentUrl);
  } catch (e) {
    // ignore
  }
}

function showAuthAlert(message, type = 'error') {
  const alertBox = document.getElementById('auth-alert');
  if (!alertBox) return;
  alertBox.style.display = 'block';
  if (type === 'error') {
    alertBox.style.backgroundColor = 'rgba(239, 68, 68, 0.12)';
    alertBox.style.color = '#dc2626';
    alertBox.style.border = '1px solid rgba(239, 68, 68, 0.3)';
    alertBox.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
  } else {
    alertBox.style.backgroundColor = 'rgba(16, 185, 129, 0.12)';
    alertBox.style.color = '#059669';
    alertBox.style.border = '1px solid rgba(16, 185, 129, 0.3)';
    alertBox.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
  }
}

function initAuthHandlers() {
  // Tab clicks for switching role portal
  document.querySelectorAll('#auth-role-tabs .role-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const role = tab.getAttribute('data-role');
      if (role) {
        switchAuthPortal(role);
      }
    });
  });

  // Demo credential quick fill button
  const demoBtn = document.getElementById('demo-fill-btn');
  if (demoBtn) {
    demoBtn.addEventListener('click', () => {
      const config = portalConfigs[state.activeRole] || portalConfigs.beneficiary;
      const userField = document.getElementById('login-username');
      const passField = document.getElementById('login-password');
      if (userField && passField) {
        userField.value = config.demoUsername;
        passField.value = config.demoPassword;
      }
    });
  }

  // Toggle to Citizen Registration Form
  const openRegBtn = document.getElementById('open-register-btn');
  if (openRegBtn) {
    openRegBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const loginBox = document.getElementById('login-form-container');
      const regBox = document.getElementById('register-form-container');
      const alertBox = document.getElementById('auth-alert');
      if (loginBox) loginBox.style.display = 'none';
      if (regBox) regBox.style.display = 'block';
      if (alertBox) alertBox.style.display = 'none';

      const authTitle = document.getElementById('auth-title');
      const authSub = document.getElementById('auth-subtitle');
      if (authTitle) authTitle.innerText = 'New Citizen Registration';
      if (authSub) authSub.innerText = 'Register your Ration Card Number to book slots and manage food grains.';
    });
  }

  // Toggle back to Login Form
  const backLoginBtn = document.getElementById('back-to-login-btn');
  if (backLoginBtn) {
    backLoginBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const loginBox = document.getElementById('login-form-container');
      const regBox = document.getElementById('register-form-container');
      const alertBox = document.getElementById('auth-alert');
      if (regBox) regBox.style.display = 'none';
      if (loginBox) loginBox.style.display = 'block';
      if (alertBox) alertBox.style.display = 'none';

      const config = portalConfigs[state.activeRole] || portalConfigs.beneficiary;
      const authTitle = document.getElementById('auth-title');
      const authSub = document.getElementById('auth-subtitle');
      if (authTitle) authTitle.innerText = config.title;
      if (authSub) authSub.innerText = config.subtitle;
    });
  }

  // Login Form Submission
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const usernameInput = document.getElementById('login-username');
      const passwordInput = document.getElementById('login-password');
      const submitBtn = document.getElementById('login-submit-btn');

      const username = usernameInput ? usernameInput.value.trim() : '';
      const password = passwordInput ? passwordInput.value : '';
      const role = state.activeRole || 'beneficiary';

      if (!username || !password) {
        showAuthAlert('Please enter both ID/Ration number and password.', 'error');
        return;
      }

      const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Authenticating...';
      }

      try {
        const res = await fetch(`${API_BASE}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password, role })
        });

        let data = {};
        const resText = await res.text();
        try {
          data = JSON.parse(resText);
        } catch (e) {
          throw new Error(`Server response error (${res.status}): ${resText.slice(0, 150)}`);
        }

        if (!res.ok) {
          throw new Error(data.error || 'Authentication failed. Please verify credentials.');
        }

        // Store session
        localStorage.setItem('pds_token', data.token);
        localStorage.setItem('pds_user', JSON.stringify(data.user));
        state.token = data.token;
        state.user = data.user;

        const alertBox = document.getElementById('auth-alert');
        if (alertBox) alertBox.style.display = 'none';

        // Load Dashboard
        showPortalDashboard();
        initSocket();
      } catch (err) {
        showAuthAlert(err.message, 'error');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHtml;
        }
      }
    });
  }

  // Citizen Registration Form Submission
  const regForm = document.getElementById('citizen-register-form');
  if (regForm) {
    regForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const rationInput = document.getElementById('reg-ration-number');
      const nameInput = document.getElementById('reg-full-name');
      const passInput = document.getElementById('reg-password');
      const confirmPassInput = document.getElementById('reg-confirm-password');
      const mobileInput = document.getElementById('reg-mobile');
      const submitBtn = document.getElementById('register-submit-btn');

      const username = rationInput ? rationInput.value.trim().toUpperCase() : '';
      const name = nameInput ? nameInput.value.trim() : '';
      const password = passInput ? passInput.value : '';
      const confirmPassword = confirmPassInput ? confirmPassInput.value : '';
      const mobile = mobileInput ? mobileInput.value.trim() : '';

      if (!username || !name || !password) {
        showAuthAlert('Please complete all required fields.', 'error');
        return;
      }

      if (password !== confirmPassword) {
        showAuthAlert('Passwords do not match. Please re-enter.', 'error');
        return;
      }

      if (password.length < 6) {
        showAuthAlert('Password must be at least 6 characters.', 'error');
        return;
      }

      const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registering Account...';
      }

      try {
        const res = await fetch(`${API_BASE}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username,
            password,
            role: 'beneficiary',
            name,
            mobile
          })
        });

        let data = {};
        const resText = await res.text();
        try {
          data = JSON.parse(resText);
        } catch (e) {
          throw new Error(`Server response error (${res.status}): ${resText.slice(0, 150)}`);
        }

        if (!res.ok) {
          throw new Error(data.error || 'Registration failed.');
        }

        // Switch back to login view with pre-filled username
        document.getElementById('register-form-container').style.display = 'none';
        document.getElementById('login-form-container').style.display = 'block';
        const config = portalConfigs.beneficiary;
        document.getElementById('auth-title').innerText = config.title;
        document.getElementById('auth-subtitle').innerText = config.subtitle;

        const userLoginField = document.getElementById('login-username');
        if (userLoginField) userLoginField.value = username;
        const passLoginField = document.getElementById('login-password');
        if (passLoginField) {
          passLoginField.value = '';
          passLoginField.focus();
        }

        showAuthAlert('Registration successful! Please sign in with your password.', 'success');
        regForm.reset();
      } catch (err) {
        showAuthAlert(err.message, 'error');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHtml;
        }
      }
    });
  }

  // Logout Button
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('pds_token');
      localStorage.removeItem('pds_user');
      state.token = null;
      state.user = null;
      showAuthSection(state.activeRole || 'beneficiary');
    });
  }

  // Forgot Password Modal Handlers
  const forgotLink = document.getElementById('forgot-password-link');
  const forgotModal = document.getElementById('forgot-password-modal');
  const closeForgotBtn = document.getElementById('close-forgot-modal');
  const sendOtpBtn = document.getElementById('send-otp-btn');
  const resetPassBtn = document.getElementById('reset-password-btn');

  if (forgotLink && forgotModal) {
    forgotLink.addEventListener('click', (e) => {
      e.preventDefault();
      const loginUser = document.getElementById('login-username');
      const forgotUser = document.getElementById('forgot-username');
      if (loginUser && forgotUser && loginUser.value) {
        forgotUser.value = loginUser.value;
      }
      document.getElementById('forgot-step-1').style.display = 'block';
      document.getElementById('forgot-step-2').style.display = 'none';
      forgotModal.classList.add('active');
    });
  }

  if (closeForgotBtn && forgotModal) {
    closeForgotBtn.addEventListener('click', () => {
      forgotModal.classList.remove('active');
    });
  }

  if (sendOtpBtn) {
    sendOtpBtn.addEventListener('click', async () => {
      const forgotUser = document.getElementById('forgot-username').value.trim();
      if (!forgotUser) {
        alert('Please enter your Ration Number or User ID.');
        return;
      }
      try {
        const res = await fetch(`${API_BASE}/api/auth/forgot-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: forgotUser })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to send OTP.');
        document.getElementById('forgot-step-1').style.display = 'none';
        document.getElementById('forgot-step-2').style.display = 'block';
        const hint = document.getElementById('simulated-otp-hint');
        if (hint && data.simulated_otp) {
          hint.innerText = `[Demo Mode] Simulated OTP: ${data.simulated_otp}`;
        }
      } catch (err) {
        alert(err.message);
      }
    });
  }

  if (resetPassBtn) {
    resetPassBtn.addEventListener('click', async () => {
      const forgotUser = document.getElementById('forgot-username').value.trim();
      const otp = document.getElementById('forgot-otp').value.trim();
      const newPass = document.getElementById('forgot-new-password').value;

      if (!otp || !newPass) {
        alert('Please enter both OTP and your new password.');
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/api/auth/verify-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: forgotUser, otp, newPassword: newPass })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to reset password.');
        forgotModal.classList.remove('active');
        showAuthAlert('Password reset successful! Please sign in with your new password.', 'success');
        const passField = document.getElementById('login-password');
        if (passField) {
          passField.value = newPass;
        }
      } catch (err) {
        alert(err.message);
      }
    });
  }
}

// Language Selector event handler
const appLangSelect = document.getElementById('language-select');
if (appLangSelect) {
  appLangSelect.addEventListener('change', (e) => {
    if (typeof updateTranslations === 'function') {
      updateTranslations(e.target.value);
    }
  });
}

// PWA Offline / Online detection
window.addEventListener('online', () => {
  const offEl = document.getElementById('offline-indicator');
  if (offEl) offEl.style.display = "none";
});
window.addEventListener('offline', () => {
  const offEl = document.getElementById('offline-indicator');
  if (offEl) offEl.style.display = "flex";
});

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
  // 1. Immediately read and set target portal role from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const roleParam = urlParams.get('role');
  const targetRole = (roleParam && ['beneficiary', 'dealer', 'admin'].includes(roleParam)) ? roleParam : 'beneficiary';
  state.activeRole = targetRole;

  initTheme();
  
  // 2. Initialize Auth Handlers
  initAuthHandlers();

  // 3. When arriving with an explicit ?role= param (from landing hub), ALWAYS show that portal's login page first
  if (roleParam) {
    localStorage.removeItem('pds_token');
    localStorage.removeItem('pds_user');
    state.token = null;
    state.user = null;
    showAuthSection(targetRole);
  } else if (state.token && state.user) {
    // Direct index.html visit without ?role= and with an active session
    showPortalDashboard();
    initSocket();
  } else {
    showAuthSection(targetRole);
  }

  // 4. Update translations with the target role already configured
  if (typeof updateTranslations === 'function') {
    updateTranslations(state.lang);
  }
  const mainLangSel = document.getElementById('language-select');
  if (mainLangSel) mainLangSel.value = state.lang;

  // Register PWA service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('Service Worker registered successfully!', reg.scope))
      .catch(err => console.error('Service Worker registration failed:', err));
  }
  
  // Initialize Geography Dropdowns
  initGeographyDropdowns();
});

// Geography Data for Cascading Dropdowns
const geoData = {
  "Andhra Pradesh": {
    "Visakhapatnam": ["Gajuwaka", "MVP Colony", "Madhurawada"],
    "Vijayawada": ["Benz Circle", "Patamata", "Bhavanipuram"],
    "Guntur": ["Brodipet", "Arundelpet", "Mangalagiri"]
  },
  "Telangana": {
    "Hyderabad": ["Ameerpet", "Kukatpally", "Gachibowli", "Secunderabad"],
    "Warangal": ["Hanamkonda", "Kazipet", "Subedari"],
    "Karimnagar": ["Godavarikhani", "Jagtial", "Ramagundam"]
  },
  "Maharashtra": {
    "Mumbai": ["Andheri", "Bandra", "Borivali", "Colaba"],
    "Pune": ["Kothrud", "Hinjewadi", "Viman Nagar"],
    "Nagpur": ["Sitabuldi", "Dharampeth", "Sadar"]
  }
};

function initGeographyDropdowns() {
  const stateSelect = document.getElementById('location-state');
  const districtSelect = document.getElementById('location-district');
  const citySelect = document.getElementById('location-city');

  if (!stateSelect || !districtSelect || !citySelect) return;

  // Populate States
  Object.keys(geoData).forEach(state => {
    const opt = document.createElement('option');
    opt.value = state;
    opt.innerText = state;
    stateSelect.appendChild(opt);
  });

  // Handle State Change
  stateSelect.addEventListener('change', (e) => {
    const selectedState = e.target.value;
    
    // Reset and Disable subsequent dropdowns
    districtSelect.innerHTML = '<option value="" disabled selected>Select District</option>';
    citySelect.innerHTML = '<option value="" disabled selected>Select City</option>';
    citySelect.disabled = true;

    if (selectedState && geoData[selectedState]) {
      districtSelect.disabled = false;
      Object.keys(geoData[selectedState]).forEach(district => {
        const opt = document.createElement('option');
        opt.value = district;
        opt.innerText = district;
        districtSelect.appendChild(opt);
      });
    } else {
      districtSelect.disabled = true;
    }
  });

  // Handle District Change
  districtSelect.addEventListener('change', (e) => {
    const selectedState = stateSelect.value;
    const selectedDistrict = e.target.value;
    
    citySelect.innerHTML = '<option value="" disabled selected>Select City</option>';
    
    if (selectedState && selectedDistrict && geoData[selectedState][selectedDistrict]) {
      citySelect.disabled = false;
      geoData[selectedState][selectedDistrict].forEach(city => {
        const opt = document.createElement('option');
        opt.value = city;
        opt.innerText = city;
        citySelect.appendChild(opt);
      });
    } else {
      citySelect.disabled = true;
    }
  });
}


// ==========================================
// LIVE CROWD MONITORING SYSTEM
// Uses TensorFlow.js COCO-SSD to detect
// persons in real-time from a camera feed
// ==========================================

class CrowdMonitor {
  constructor(config) {
    // config: { videoEl, canvasEl, countEl, dotEl, labelEl,
    //           meterEl, statusBoxEl, statusIconEl, statusTitleEl,
    //           statusSubEl, historyListEl, startBtn, stopBtn,
    //           maxCapacity (optional) }
    this.cfg = config;
    this.model = null;
    this.stream = null;
    this.rafId = null;
    this.isRunning = false;
    this.historyLog = [];
    this.maxCapacity = config.maxCapacity || 10; // treat 10+ as high crowd
    this.lastLogTime = 0;
  }

  /* ---------- Public API ---------- */
  async start() {
    if (this.isRunning) return;
    this._showLoadingOverlay('Loading AI model…');
    try {
      // 1. Load COCO-SSD model (cached after first load)
      if (!window._cocoSsdModel) {
        window._cocoSsdModel = await cocoSsd.load({ base: 'lite_mobilenet_v2' });
      }
      this.model = window._cocoSsdModel;

      // 2. Request camera
      this._showLoadingOverlay('Accessing camera…');
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false
      });
      this.cfg.videoEl.srcObject = this.stream;
      await new Promise(res => this.cfg.videoEl.addEventListener('loadedmetadata', res, { once: true }));
      await this.cfg.videoEl.play();

      this._removeLoadingOverlay();
      this.isRunning = true;
      this._setLiveDot('live', 'LIVE');
      this._loop();

      // UI button swap
      this.cfg.startBtn.style.display = 'none';
      this.cfg.stopBtn.style.display = '';
    } catch (err) {
      this._removeLoadingOverlay();
      console.error('[CrowdMonitor] Error:', err);
      let msg = 'Failed to start.';
      if (err.name === 'NotAllowedError') msg = 'Camera permission denied. Please allow camera access.';
      else if (err.name === 'NotFoundError') msg = 'No camera found on this device.';
      this._updateStatus('error', '<i class="fas fa-circle-exclamation"></i>', 'Camera Error', msg);
      this._setLiveDot('', 'Offline');
    }
  }

  stop() {
    if (!this.isRunning) return;
    this.isRunning = false;
    cancelAnimationFrame(this.rafId);
    if (this.stream) {
      this.stream.getTracks().forEach(t => t.stop());
      this.stream = null;
    }
    this.cfg.videoEl.srcObject = null;
    // Clear canvas
    const ctx = this.cfg.canvasEl.getContext('2d');
    ctx.clearRect(0, 0, this.cfg.canvasEl.width, this.cfg.canvasEl.height);

    this._setLiveDot('', 'Offline');
    this._updateStatus('', '<i class="fas fa-circle-question"></i>', 'Camera Off', 'Press Start Monitoring to activate.');
    this._updateCountUI(0);
    this.cfg.startBtn.style.display = '';
    this.cfg.stopBtn.style.display = 'none';
  }

  /* ---------- Detection Loop ---------- */
  async _loop() {
    if (!this.isRunning) return;
    const { videoEl, canvasEl } = this.cfg;

    // Sync canvas size to video
    if (videoEl.videoWidth > 0) {
      canvasEl.width = videoEl.videoWidth;
      canvasEl.height = videoEl.videoHeight;
    }

    try {
      const predictions = await this.model.detect(videoEl);
      const persons = predictions.filter(p => p.class === 'person');
      this._drawBoxes(persons);
      this._updateCountUI(persons.length);
      this._logHistory(persons.length);
    } catch (_) { /* ignore frame errors */ }

    this.rafId = requestAnimationFrame(() => this._loop());
  }

  /* ---------- Canvas Drawing ---------- */
  _drawBoxes(persons) {
    const canvas = this.cfg.canvasEl;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    persons.forEach((p, i) => {
      const [x, y, w, h] = p.bbox;
      const score = Math.round(p.score * 100);
      const color = this._levelColor(persons.length);

      // Bounding box
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      ctx.strokeRect(x, y, w, h);

      // Semi-transparent fill
      ctx.fillStyle = color.replace('1)', '0.08)');
      ctx.fillRect(x, y, w, h);

      // Label badge
      const label = `Person ${i + 1}  ${score}%`;
      ctx.font = 'bold 13px Inter, sans-serif';
      const tw = ctx.measureText(label).width;
      ctx.fillStyle = color;
      ctx.fillRect(x, y > 22 ? y - 22 : y, tw + 10, 22);
      ctx.fillStyle = '#fff';
      ctx.fillText(label, x + 5, y > 22 ? y - 6 : y + 14);
    });
  }

  /* ---------- UI Updates ---------- */
  _updateCountUI(count) {
    // Number
    this.cfg.countEl.textContent = count;

    // Meter %
    const pct = Math.min((count / this.maxCapacity) * 100, 100);
    this.cfg.meterEl.style.width = pct + '%';

    // Status
    const level = this._crowdLevel(count);
    const box = this.cfg.statusBoxEl;
    box.className = 'crowd-stat-box'; // reset
    if (level === 'low')  { box.classList.add('level-low');  this._setLiveDot('live', 'LIVE — Low'); }
    if (level === 'mod')  { box.classList.add('level-mod');  this._setLiveDot('warning', 'LIVE — Moderate'); }
    if (level === 'high') { box.classList.add('level-high'); this._setLiveDot('danger',  'LIVE — HIGH'); }

    const icons = { low: 'fa-face-smile', mod: 'fa-face-meh', high: 'fa-face-dizzy' };
    const titles = { low: 'Shop is Clear', mod: 'Moderate Crowd', high: '⚠ High Crowd!' };
    const subs = {
      low:  `${count} person(s) detected. Shop is comfortably accessible.`,
      mod:  `${count} person(s) detected. Moderate queue. Manage wait times.`,
      high: `${count} person(s) detected! Shop is crowded. Alert beneficiaries.`
    };
    this._updateStatus(level, `<i class="fas ${icons[level]}"></i>`, titles[level], subs[level]);
  }

  _updateStatus(level, iconHTML, title, sub) {
    this.cfg.statusIconEl.innerHTML = iconHTML;
    this.cfg.statusTitleEl.textContent = title;
    this.cfg.statusSubEl.textContent = sub;
  }

  _logHistory(count) {
    const now = Date.now();
    if (now - this.lastLogTime < 2000) return; // increase frequency to 2s for more real-time feel
    
    // Don't add duplicate entries consecutively (only log when count changes)
    if (this.historyLog.length > 0 && this.historyLog[0].count === count) {
      // Just update the time of the latest entry instead of duplicating
      this.historyLog[0].time = new Date().toLocaleTimeString();
    } else {
      this.lastLogTime = now;
      const time = new Date().toLocaleTimeString();
      this.historyLog.unshift({ time, count });
      if (this.historyLog.length > 8) this.historyLog.pop();
    }
    
    const list = this.cfg.historyListEl;
    list.innerHTML = this.historyLog.map(e =>
      `<li><span>${e.time}</span><span class="crowd-log-count">${e.count} person(s)</span></li>`
    ).join('');
  }

  /* ---------- Helpers ---------- */
  _crowdLevel(count) {
    if (count < 4)  return 'low';
    if (count < 8)  return 'mod';
    return 'high';
  }

  _levelColor(count) {
    const level = this._crowdLevel(count);
    if (level === 'low')  return 'rgba(34,197,94,1)';
    if (level === 'mod')  return 'rgba(249,115,22,1)';
    return 'rgba(239,68,68,1)';
  }

  _setLiveDot(cls, label) {
    this.cfg.dotEl.className = 'crowd-live-dot' + (cls ? ' ' + cls : '');
    this.cfg.labelEl.textContent = label;
  }

  _showLoadingOverlay(text) {
    this._removeLoadingOverlay();
    const wrapper = this.cfg.videoEl.parentElement;
    const div = document.createElement('div');
    div.className = 'crowd-model-loading';
    div.id = 'crowd-loading-' + this.cfg.videoEl.id;
    div.innerHTML = `<div class="crowd-spinner"></div><span>${text}</span>`;
    wrapper.appendChild(div);
  }

  _removeLoadingOverlay() {
    const el = document.getElementById('crowd-loading-' + this.cfg.videoEl.id);
    if (el) el.remove();
  }
}

/* ---- Wire up Dealer crowd monitor ---- */
function initDealerCrowdMonitor() {
  const monitor = new CrowdMonitor({
    videoEl:       document.getElementById('dealer-crowd-video'),
    canvasEl:      document.getElementById('dealer-crowd-canvas'),
    countEl:       document.getElementById('dealer-crowd-count'),
    dotEl:         document.getElementById('dealer-crowd-live-dot'),
    labelEl:       document.getElementById('dealer-crowd-live-label'),
    meterEl:       document.getElementById('dealer-crowd-meter-fill'),
    statusBoxEl:   document.getElementById('dealer-crowd-status-box'),    // was statusEl
    statusIconEl:  document.getElementById('dealer-crowd-status-icon'),
    statusTitleEl: document.getElementById('dealer-crowd-status-title'),
    statusSubEl:   document.getElementById('dealer-crowd-status-sub'),
    historyListEl: document.getElementById('dealer-crowd-history'),
    startBtn:      document.getElementById('dealer-start-crowd-btn'),
    stopBtn:       document.getElementById('dealer-stop-crowd-btn'),
    maxCapacity:   10
  });

  document.getElementById('dealer-start-crowd-btn').addEventListener('click', () => monitor.start());
  document.getElementById('dealer-stop-crowd-btn').addEventListener('click',  () => monitor.stop());
}



/* ---- Auto-initialize when dashboard sections become visible ---- */
(function () {
  let dealerInited = false;
  let adminInited  = false;

  const observer = new MutationObserver(() => {
    const dealerDash = document.getElementById('dealer-dashboard');
    const adminDash  = document.getElementById('admin-dashboard');

    if (!dealerInited && dealerDash && dealerDash.style.display !== 'none') {
      dealerInited = true;
      initDealerCrowdMonitor();
    }
  });

  observer.observe(document.body, { attributes: true, subtree: true, attributeFilter: ['style'] });
})();

/* ---- Background Preload Model ---- */
// Preload the AI model in the background as soon as the app loads
// so that starting the camera is instantaneous.
window.addEventListener('load', () => {
  if (typeof cocoSsd !== 'undefined' && !window._cocoSsdModel) {
    console.log('[CrowdMonitor] Preloading AI model in the background...');
    cocoSsd.load({ base: 'lite_mobilenet_v2' }).then(model => {
      window._cocoSsdModel = model;
      console.log('[CrowdMonitor] Model preloaded successfully!');
    }).catch(console.error);
  }
});
const indiaGeoData = {
  "Andhra Pradesh": ["Alluri Sitharama Raju","Anakapalli","Ananthapuramu","Annamayya","Bapatla","Chittoor","Dr. B.R. Ambedkar Konaseema","East Godavari","Eluru","Guntur","Kakinada","Krishna","Kurnool","Markapuram","Nandyal","NTR","Palnadu","Parvathipuram Manyam","Polavaram","Prakasam","Sri Potti Sriramulu Nellore","Sri Sathya Sai","Srikakulam","Tirupati","Visakhapatnam","Vizianagaram","West Godavari","YSR Kadapa"],
  "Arunachal Pradesh": ["Anjaw","Bichom","Changlang","Dibang Valley","East Kameng","East Siang","Kamle","Keyi Panyor","Kra Daadi","Kurung Kumey","Leparada","Lohit","Longding","Lower Dibang Valley","Lower Siang","Lower Subansiri","Namsai","Pakke Kessang","Papum Pare","Shi Yomi","Siang","Tawang","Tirap","Upper Siang","Upper Subansiri","West Kameng","West Siang"],
  "Assam": ["Bajali","Baksa","Barpeta","Biswanath","Bongaigaon","Cachar","Charaideo","Chirang","Darrang","Dhemaji","Dhubri","Dibrugarh","Dima Hasao","Goalpara","Golaghat","Hailakandi","Hojai","Jorhat","Kamrup","Kamrup Metropolitan","Karbi Anglong","Kokrajhar","Lakhimpur","Majuli","Morigaon","Nagaon","Nalbari","Sivasagar","Sonitpur","South Salmara-Mankachar","Tamulpur","Tinsukia","Udalguri","West Karbi Anglong"],
  "Bihar": ["Araria","Arwal","Aurangabad","Banka","Begusarai","Bhagalpur","Bhojpur","Buxar","Darbhanga","Gaya","Gopalganj","Jamui","Jehanabad","Kaimur (Bhabua)","Katihar","Khagaria","Kishanganj","Lakhisarai","Madhepura","Madhubani","Munger","Muzaffarpur","Nalanda","Nawada","Pashchim Champaran","Patna","Purba Champaran","Purnia","Rohtas","Saharsa","Samastipur","Saran","Sheikhpura","Sheohar","Sitamarhi","Siwan","Supaul","Vaishali"],
  "Chhattisgarh": ["Balod","Balodabazar-Bhatapara","Balrampur-Ramanujganj","Bastar","Bemetara","Bijapur","Bilaspur","Dakshin Bastar Dantewada","Dhamtari","Durg","Gariyaband","Gaurela-Pendra-Marwahi","Janjgir-Champa","Jashpur","Kabeerdham","Khairagarh-Chhuikhadan-Gandai","Kondagaon","Korba","Korea","Mahasamund","Manendragarh-Chirmiri-Bharatpur","Mohla-Manpur-Ambagarh Chouki","Mungeli","Narayanpur","Raigarh","Raipur","Rajnandgaon","Sakti","Sarangarh-Bilaigarh","Sukma","Surajpur","Surguja","Baloda Bazar"],
  "Goa": ["Kushavati","North Goa","South Goa"],
  "Gujarat": ["Ahmedabad","Amreli","Anand","Aravalli","Banaskantha","Bharuch","Bhavnagar","Botad","Chhota Udaipur","Dahod","Dang","Devbhumi Dwarka","Gandhinagar","Gir Somnath","Jamnagar","Junagadh","Kachchh","Kheda","Mahisagar","Mahesana","Morbi","Narmada","Navsari","Panchmahal","Patan","Porbandar","Rajkot","Sabarkantha","Surat","Surendranagar","Tapi","Vadodara","Valsad","Vav-Tharad"],
  "Haryana": ["Ambala","Bhiwani","Charkhi Dadri","Faridabad","Fatehabad","Gurugram","Hansi","Hisar","Jhajjar","Jind","Kaithal","Karnal","Kurukshetra","Mahendragarh","Nuh","Palwal","Panchkula","Panipat","Rewari","Rohtak","Sirsa","Sonipat","Yamunanagar"],
  "Himachal Pradesh": ["Bilaspur","Chamba","Hamirpur","Kangra","Kinnaur","Kullu","Lahaul and Spiti","Mandi","Shimla","Sirmaur","Solan","Una"],
  "Jharkhand": ["Bokaro","Chatra","Deoghar","Dhanbad","Dumka","East Singhbhum","Garhwa","Giridih","Godda","Gumla","Hazaribagh","Jamtara","Khunti","Koderma","Latehar","Lohardaga","Pakur","Palamu","Ramgarh","Ranchi","Sahebganj","Saraikela Kharsawan","Simdega","West Singhbhum"],
  "Karnataka": ["Bagalkote","Ballari","Belagavi","Bengaluru Rural","Bengaluru South","Bengaluru Urban","Bidar","Chamarajanagar","Chikkaballapura","Chikkamagaluru","Chitradurga","Dakshina Kannada","Davanagere","Dharwad","Gadag","Hassan","Haveri","Kalaburagi","Kodagu","Kolar","Koppal","Mandya","Mysuru","Raichur","Shivamogga","Tumakuru","Udupi","Uttara Kannada","Vijayapura","Vijayanagara","Yadgir"],
  "Kerala": ["Alappuzha","Ernakulam","Idukki","Kannur","Kasaragod","Kollam","Kottayam","Kozhikode","Malappuram","Palakkad","Pathanamthitta","Thiruvananthapuram","Thrissur","Wayanad"],
  "Madhya Pradesh": ["Agar-Malwa","Alirajpur","Anuppur","Ashoknagar","Balaghat","Barwani","Betul","Bhind","Bhopal","Burhanpur","Chhatarpur","Chhindwara","Damoh","Datia","Dewas","Dhar","Dindori","Guna","Gwalior","Harda","Indore","Jabalpur","Jhabua","Katni","Khandwa","Khargone","Maihar","Mandla","Mandsaur","Mauganj","Morena","Narmadapuram","Narsinghpur","Neemuch","Niwari","Panna","Raisen","Rajgarh","Ratlam","Rewa","Sagar","Satna","Sehore","Seoni","Shahdol","Shajapur","Sheopur","Shivpuri","Sidhi","Singrauli","Tikamgarh","Ujjain","Umaria","Vidisha","Pandhurna"],
  "Maharashtra": ["Ahilyanagar","Akola","Amravati","Beed","Bhandara","Buldhana","Chandrapur","Chhatrapati Sambhajinagar","Dharashiv","Dhule","Gadchiroli","Gondia","Hingoli","Jalgaon","Jalna","Kolhapur","Latur","Mumbai","Mumbai Suburban","Nagpur","Nanded","Nandurbar","Nashik","Palghar","Parbhani","Pune","Raigad","Ratnagiri","Sangli","Satara","Sindhudurg","Solapur","Thane","Wardha","Washim","Yavatmal"],
  "Manipur": ["Bishnupur","Chandel","Churachandpur","Imphal East","Imphal West","Jiribam","Kakching","Kamjong","Kangpokpi","Noney","Pherzawl","Senapati","Tamenglong","Tengnoupal","Thoubal","Ukhrul"],
  "Meghalaya": ["East Garo Hills","East Jaintia Hills","East Khasi Hills","Eastern West Khasi Hills","North Garo Hills","Ri Bhoi","South Garo Hills","South West Garo Hills","South West Khasi Hills","West Garo Hills","West Jaintia Hills","West Khasi Hills"],
  "Mizoram": ["Aizawl","Champhai","Hnahthial","Khawzawl","Kolasib","Lawngtlai","Lunglei","Mamit","Saitual","Serchhip","Siaha"],
  "Nagaland": ["Chumoukedima","Dimapur","Kiphire","Kohima","Longleng","Meluri","Mokokchung","Mon","Niuland","Noklak","Peren","Phek","Shamator","Tseminyu","Tuensang","Wokha","Zunheboto"],
  "Odisha": ["Angul","Balangir","Balasore","Bargarh","Bhadrak","Boudh","Deogarh","Dhenkanal","Gajapati","Ganjam","Jagatsinghpur","Jajpur","Jharsuguda","Kalahandi","Kandhamal","Kendrapara","Kendujhar","Khordha","Koraput","Malkangiri","Mayurbhanj","Nabarangpur","Nayagarh","Nuapada","Puri","Rayagada","Sambalpur","Subarnapur","Sundargarh","Cuttack"],
  "Punjab": ["Amritsar","Barnala","Bathinda","Faridkot","Fatehgarh Sahib","Fazilka","Ferozepur","Gurdaspur","Hoshiarpur","Jalandhar","Kapurthala","Ludhiana","Malerkotla","Mansa","Moga","Pathankot","Patiala","Rupnagar","S.A.S. Nagar","Sangrur","Shahid Bhagat Singh Nagar","Sri Muktsar Sahib","Tarn Taran"],
  "Rajasthan": ["Ajmer","Alwar","Balotra","Banswara","Baran","Barmer","Beawar","Bharatpur","Bhilwara","Bikaner","Bundi","Chittorgarh","Churu","Dausa","Deeg","Dholpur","Didwana-Kuchaman","Dungarpur","Ganganagar","Hanumangarh","Jaipur","Jaisalmer","Jalore","Jhalawar","Jhunjhunu","Jodhpur","Karauli","Kota","Kotputli-Behror","Nagaur","Pali","Phalodi","Pratapgarh","Rajsamand","Sawai Madhopur","Sikar","Sirohi","Sri Ganganagar","Tonk","Udaipur","Salumbar"],
  "Sikkim": ["Gangtok","Gyalshing","Mangan","Namchi","Pakyong","Soreng"],
  "Tamil Nadu": ["Ariyalur","Chengalpattu","Chennai","Coimbatore","Cuddalore","Dharmapuri","Dindigul","Erode","Kallakurichi","Kancheepuram","Kanniyakumari","Karur","Krishnagiri","Madurai","Mayiladuthurai","Nagapattinam","Namakkal","Perambalur","Pudukkottai","Ramanathapuram","Ranipet","Salem","Sivaganga","Tenkasi","Thanjavur","The Nilgiris","Theni","Thoothukudi","Tiruchirappalli","Tirunelveli","Tirupathur","Tiruppur","Tiruvallur","Tiruvannamalai","Tiruvarur","Vellore","Viluppuram","Virudhunagar"],
  "Telangana": ["Adilabad","Bhadradri Kothagudem","Hanamkonda","Hyderabad","Jagtial","Jangaon","Jayashankar Bhupalpally","Jogulamba Gadwal","Kamareddy","Karimnagar","Khammam","Komaram Bheem Asifabad","Mahabubabad","Mahabubnagar","Mancherial","Medak","Medchal-Malkajgiri","Mulugu","Nagarkurnool","Nalgonda","Narayanpet","Nirmal","Nizamabad","Peddapalli","Rajanna Sircilla","Rangareddy","Sangareddy","Siddipet","Suryapet","Vikarabad","Wanaparthy","Warangal","Yadadri Bhuvanagiri"],
  "Tripura": ["Dhalai","Gomati","Khowai","North Tripura","Sepahijala","South Tripura","Unakoti","West Tripura"],
  "Uttar Pradesh": ["Agra","Aligarh","Ambedkar Nagar","Amethi","Amroha","Auraiya","Ayodhya","Azamgarh","Bagpat","Bahraich","Ballia","Balrampur","Banda","Barabanki","Bareilly","Basti","Bhadohi","Bijnor","Budaun","Bulandshahr","Chandauli","Chitrakoot","Deoria","Etah","Etawah","Farrukhabad","Fatehpur","Firozabad","Gautam Buddha Nagar","Ghaziabad","Ghazipur","Gonda","Gorakhpur","Hamirpur","Hapur","Hardoi","Hathras","Jalaun","Jaunpur","Jhansi","Kannauj","Kanpur Dehat","Kanpur Nagar","Kasganj","Kaushambi","Kushinagar","Lakhimpur Kheri","Lalitpur","Lucknow","Maharajganj","Mahoba","Mainpuri","Mathura","Mau","Meerut","Mirzapur","Moradabad","Muzaffarnagar","Pilibhit","Pratapgarh","Prayagraj","Raebareli","Rampur","Saharanpur","Sambhal","Sant Kabir Nagar","Shahjahanpur","Shamli","Shravasti","Siddharthnagar","Sitapur","Sonbhadra","Sultanpur","Unnao","Varanasi"],
  "Uttarakhand": ["Almora","Bageshwar","Chamoli","Champawat","Dehradun","Haridwar","Nainital","Pauri Garhwal","Pithoragarh","Rudraprayag","Tehri Garhwal","Udham Singh Nagar","Uttarkashi"],
  "West Bengal": ["Alipurduar","Bankura","Birbhum","Cooch Behar","Dakshin Dinajpur","Darjeeling","Hooghly","Howrah","Jalpaiguri","Jhargram","Kalimpong","Kolkata","Maldah","Murshidabad","Nadia","North 24 Parganas","Paschim Bardhaman","Paschim Medinipur","Purba Bardhaman","Purba Medinipur","Purulia","South 24 Parganas","Uttar Dinajpur"],
  "Andaman and Nicobar Islands": ["Nicobar","North and Middle Andaman","South Andaman"],
  "Chandigarh": ["Chandigarh"],
  "Dadra and Nagar Haveli and Daman and Diu": ["Dadra and Nagar Haveli","Daman","Diu"],
  "Delhi": ["Central","Central North","East","New Delhi","North","North East","North West","Old Delhi","Outer North","South","South East","South West","West"],
  "Jammu and Kashmir": ["Anantnag","Bandipora","Baramulla","Budgam","Doda","Ganderbal","Jammu","Kathua","Kishtwar","Kulgam","Kupwara","Poonch","Pulwama","Rajouri","Ramban","Reasi","Samba","Shopian","Srinagar","Udhampur"],
  "Ladakh": ["Kargil","Leh"],
  "Lakshadweep": ["Lakshadweep District"],
  "Puducherry": ["Karaikal","Puducherry"]
};

// Auto-populate states and districts on admin dashboard load
window.addEventListener('DOMContentLoaded', () => {
  const stateSelect = document.getElementById('admin-state-filter');
  const districtSelect = document.getElementById('admin-district-filter');
  const mandalSelect = document.getElementById('admin-mandal-filter');
  
  if(stateSelect && districtSelect) {
    // Populate States
    Object.keys(indiaGeoData).sort().forEach(state => {
      const opt = document.createElement('option');
      opt.value = state;
      opt.textContent = state;
      stateSelect.appendChild(opt);
    });

    // Handle State change to populate Districts
    stateSelect.addEventListener('change', (e) => {
      const selectedState = e.target.value;
      districtSelect.innerHTML = '<option value="ALL">All Districts</option>';
      if (mandalSelect) mandalSelect.innerHTML = '<option value="ALL">All Regions</option>';
      
      if (selectedState !== 'ALL' && indiaGeoData[selectedState]) {
        indiaGeoData[selectedState].sort().forEach(district => {
          const opt = document.createElement('option');
          opt.value = district;
          opt.textContent = district;
          districtSelect.appendChild(opt);
        });
      }
      
      // Auto-fetch data on state change
      if (typeof fetchAdminDashboard === 'function') fetchAdminDashboard();
    });

    // Handle District change to populate Regions (Rural/Urban)
    if (mandalSelect) {
      districtSelect.addEventListener('change', (e) => {
        const selectedDistrict = e.target.value;
        mandalSelect.innerHTML = '<option value="ALL">All Regions</option>';
        
        if (selectedDistrict !== 'ALL') {
          const optRural = document.createElement('option');
          optRural.value = `${selectedDistrict} Rural`;
          optRural.textContent = `${selectedDistrict} Rural`;
          
          const optUrban = document.createElement('option');
          optUrban.value = `${selectedDistrict} Urban`;
          optUrban.textContent = `${selectedDistrict} Urban`;
          
          mandalSelect.appendChild(optRural);
          mandalSelect.appendChild(optUrban);
        }
        
        // Auto-fetch data on district change
        if (typeof fetchAdminDashboard === 'function') fetchAdminDashboard();
      });
      
      // Handle Mandal change
      mandalSelect.addEventListener('change', () => {
        // Auto-fetch data on mandal change
        if (typeof fetchAdminDashboard === 'function') fetchAdminDashboard();
      });
    }
  }
});

