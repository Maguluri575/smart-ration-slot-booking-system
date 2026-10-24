-- Supabase PostgreSQL Schema Script for Smart Ration Slot Booking & PDS Management System
-- Paste this entire script into the Supabase SQL Editor and click 'Run' to set up the database and permissions.

-- Drop existing tables if they exist to allow clean reinstall
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS chatbot_faq CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS booking_commodities CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS slots CASCADE;
DROP TABLE IF EXISTS stock_transactions CASCADE;
DROP TABLE IF EXISTS shop_stocks CASCADE;
DROP TABLE IF EXISTS commodities CASCADE;
DROP TABLE IF EXISTS government_admins CASCADE;
DROP TABLE IF EXISTS dealers CASCADE;
DROP TABLE IF EXISTS beneficiaries CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS ration_shops CASCADE;
DROP TABLE IF EXISTS locations CASCADE;

-- 1. Locations Table
CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    mandal VARCHAR(100) NOT NULL,
    village_area VARCHAR(100) NOT NULL
);

-- 2. Ration Shops Table
CREATE TABLE ration_shops (
    id SERIAL PRIMARY KEY,
    shop_name VARCHAR(150) NOT NULL,
    shop_code VARCHAR(50) UNIQUE NOT NULL,
    location_id INTEGER REFERENCES locations(id) ON DELETE SET NULL,
    address TEXT,
    contact_number VARCHAR(15),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('beneficiary', 'dealer', 'admin')) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Beneficiaries Table
CREATE TABLE beneficiaries (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    q_ration_number VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    mobile_number VARCHAR(15),
    ration_shop_id INTEGER REFERENCES ration_shops(id) ON DELETE SET NULL,
    card_type VARCHAR(10) CHECK (card_type IN ('AAY', 'PHH', 'NPHH')) NOT NULL,
    family_members INTEGER DEFAULT 1,
    monthly_income NUMERIC(10,2) DEFAULT 0.00,
    rice_quota NUMERIC(6,2) DEFAULT 0.00,
    wheat_quota NUMERIC(6,2) DEFAULT 0.00,
    sugar_quota NUMERIC(6,2) DEFAULT 0.00,
    gas_connection INTEGER CHECK (gas_connection IN (0, 1)) DEFAULT 0,
    account_status VARCHAR(15) CHECK (account_status IN ('ACTIVE', 'SUSPENDED')) DEFAULT 'ACTIVE'
);

-- 5. Dealers Table
CREATE TABLE dealers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    dealer_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    ration_shop_id INTEGER REFERENCES ration_shops(id) ON DELETE SET NULL
);

-- 6. Government Admins Table
CREATE TABLE government_admins (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    admin_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    department VARCHAR(100)
);

-- 7. Commodities Table
CREATE TABLE commodities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    unit VARCHAR(10) NOT NULL
);

-- 8. Shop Stocks Table
CREATE TABLE shop_stocks (
    id SERIAL PRIMARY KEY,
    ration_shop_id INTEGER REFERENCES ration_shops(id) ON DELETE CASCADE,
    commodity_id INTEGER REFERENCES commodities(id) ON DELETE CASCADE,
    allocated_quantity NUMERIC(12,2) DEFAULT 0.00,
    distributed_quantity NUMERIC(12,2) DEFAULT 0.00,
    remaining_quantity NUMERIC(12,2) DEFAULT 0.00,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(ration_shop_id, commodity_id)
);

-- 9. Stock Transactions Table
CREATE TABLE stock_transactions (
    id SERIAL PRIMARY KEY,
    ration_shop_id INTEGER REFERENCES ration_shops(id) ON DELETE CASCADE,
    commodity_id INTEGER REFERENCES commodities(id) ON DELETE CASCADE,
    quantity NUMERIC(12,2) NOT NULL,
    transaction_type VARCHAR(20) CHECK (transaction_type IN ('SUPPLY', 'DISTRIBUTION', 'ADJUSTMENT')) NOT NULL,
    reference_id VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Slots Table
CREATE TABLE slots (
    id SERIAL PRIMARY KEY,
    ration_shop_id INTEGER REFERENCES ration_shops(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    time_slot VARCHAR(50) NOT NULL,
    max_capacity INTEGER DEFAULT 10,
    booked_count INTEGER DEFAULT 0,
    UNIQUE(ration_shop_id, date, time_slot)
);

-- 11. Bookings Table
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    booking_id VARCHAR(50) UNIQUE NOT NULL,
    beneficiary_id INTEGER REFERENCES beneficiaries(id) ON DELETE CASCADE,
    ration_shop_id INTEGER REFERENCES ration_shops(id) ON DELETE CASCADE,
    slot_id INTEGER REFERENCES slots(id) ON DELETE SET NULL,
    booking_date DATE NOT NULL,
    time_slot VARCHAR(50) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('BOOKED', 'CHECKED_IN', 'COMPLETED', 'MISSED', 'RESCHEDULED', 'CANCELLED')) DEFAULT 'BOOKED',
    qr_code_data TEXT,
    created_by VARCHAR(15) CHECK (created_by IN ('beneficiary', 'dealer')) DEFAULT 'beneficiary',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. Booking Commodities Table
CREATE TABLE booking_commodities (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER REFERENCES bookings(id) ON DELETE CASCADE,
    commodity_id INTEGER REFERENCES commodities(id) ON DELETE CASCADE,
    requested_quantity NUMERIC(6,2) NOT NULL,
    distributed_quantity NUMERIC(6,2) DEFAULT 0.00
);

-- 13. Notifications Table
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(30) NOT NULL, -- 'booking', 'stock', 'announcement'
    is_read INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 14. Chatbot FAQ Table
CREATE TABLE chatbot_faq (
    id SERIAL PRIMARY KEY,
    category VARCHAR(50),
    question_en TEXT,
    question_hi TEXT,
    question_te TEXT,
    answer_en TEXT,
    answer_hi TEXT,
    answer_te TEXT
);

-- 15. Audit Logs Table
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    action VARCHAR(100) NOT NULL,
    user_role VARCHAR(20),
    user_id INTEGER,
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance optimization
CREATE INDEX idx_bookings_beneficiary ON bookings(beneficiary_id);
CREATE INDEX idx_bookings_shop_date ON bookings(ration_shop_id, booking_date);
CREATE INDEX idx_slots_shop_date ON slots(ration_shop_id, date);
CREATE INDEX idx_shop_stocks_shop ON shop_stocks(ration_shop_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);

-- ========================================================
-- INITIAL SEED DATA (Demo Users, Shops, Stock, and FAQ)
-- ========================================================

-- 1. Locations
INSERT INTO locations (id, state, district, mandal, village_area) VALUES 
(1, 'Telangana', 'Hyderabad', 'Ameerpet', 'Ameerpet Ward 5'),
(2, 'Telangana', 'RangaReddy', 'Serilingampally', 'Gachibowli Area'),
(3, 'Andhra Pradesh', 'Visakhapatnam', 'Gajuwaka', 'Gajuwaka Ward 12');

-- 2. Ration Shops
INSERT INTO ration_shops (id, shop_name, shop_code, location_id, address, contact_number) VALUES 
(1, 'Ameerpet PDS Shop #101', 'PDS-500016', 1, 'Near Ameerpet Metro, Hyderabad', '9876543210'),
(2, 'Gachibowli PDS Shop #204', 'PDS-500032', 2, 'Telecom Nagar, Gachibowli, Hyderabad', '9876543211'),
(3, 'Gajuwaka PDS Shop #309', 'PDS-530026', 3, 'Main Road Gajuwaka, Visakhapatnam', '9876543212');

-- 3. Commodities
INSERT INTO commodities (id, name, unit) VALUES 
(1, 'Rice', 'kg'),
(2, 'Wheat', 'kg'),
(3, 'Sugar', 'kg'),
(4, 'Kerosene', 'L');

-- 4. Users (Password is 'password' hashed with bcrypt)
INSERT INTO users (id, username, password_hash, role) VALUES 
(1, 'RATION999', '$2a$10$H6d0ueFdumNqBPh/5RLlNeF9DDv2z1aDWxiMNseth92OykB/SBS4y', 'beneficiary'),
(2, 'RATION888', '$2a$10$H6d0ueFdumNqBPh/5RLlNeF9DDv2z1aDWxiMNseth92OykB/SBS4y', 'beneficiary'),
(3, 'RATION777', '$2a$10$H6d0ueFdumNqBPh/5RLlNeF9DDv2z1aDWxiMNseth92OykB/SBS4y', 'beneficiary'),
(4, 'RATION666', '$2a$10$H6d0ueFdumNqBPh/5RLlNeF9DDv2z1aDWxiMNseth92OykB/SBS4y', 'beneficiary'),
(5, 'DEALER101', '$2a$10$H6d0ueFdumNqBPh/5RLlNeF9DDv2z1aDWxiMNseth92OykB/SBS4y', 'dealer'),
(6, 'DEALER204', '$2a$10$H6d0ueFdumNqBPh/5RLlNeF9DDv2z1aDWxiMNseth92OykB/SBS4y', 'dealer'),
(7, 'ADMIN001',  '$2a$10$H6d0ueFdumNqBPh/5RLlNeF9DDv2z1aDWxiMNseth92OykB/SBS4y', 'admin');

-- 5. Beneficiaries
INSERT INTO beneficiaries (id, user_id, q_ration_number, name, mobile_number, ration_shop_id, card_type, family_members, monthly_income, rice_quota, wheat_quota, sugar_quota, gas_connection, account_status) VALUES 
(1, 1, 'RATION999', 'Ramesh Kumar', '9123456789', 1, 'PHH', 4, 4500.00, 24.0, 4.0, 1.0, 1, 'ACTIVE'),
(2, 2, 'RATION888', 'Anasuya Devi', '9123456788', 1, 'AAY', 2, 1200.00, 35.0, 2.0, 1.0, 0, 'ACTIVE'),
(3, 3, 'RATION777', 'Vijay Bhaskar', '9123456787', 1, 'PHH', 3, 3800.00, 18.0, 3.0, 1.0, 1, 'ACTIVE'),
(4, 4, 'RATION666', 'Sita Kumari', '9123456786', 1, 'NPHH', 5, 22000.00, 2.0, 1.0, 0.0, 1, 'ACTIVE');

-- 6. Dealers
INSERT INTO dealers (id, user_id, dealer_code, name, ration_shop_id) VALUES 
(1, 5, 'DEALER101', 'Kishore Kumar', 1),
(2, 6, 'DEALER204', 'Rajesh Goud', 2);

-- 7. Government Admins
INSERT INTO government_admins (id, user_id, admin_code, name, department) VALUES 
(1, 7, 'ADMIN001', 'Suresh Reddy', 'Civil Supplies');

-- 8. Shop Stocks
INSERT INTO shop_stocks (ration_shop_id, commodity_id, allocated_quantity, distributed_quantity, remaining_quantity) VALUES 
(1, 1, 5000, 1800, 3200),
(1, 2, 1500, 450, 1050),
(1, 3, 500, 200, 300),
(1, 4, 300, 120, 180),
(2, 1, 6000, 2500, 3500),
(2, 2, 2000, 800, 1200),
(2, 3, 600, 300, 300),
(2, 4, 400, 200, 200);

-- 9. Chatbot FAQ
INSERT INTO chatbot_faq (category, question_en, question_hi, question_te, answer_en, answer_hi, answer_te) VALUES 
('Booking', 'How to book a ration slot?', 'राशन स्लॉट कैसे बुक करें?', 'రేషన్ స్లాట్ ఎలా బుక్ చేయాలి?', 'Log in to your portal. Click ''Book Slot'', choose your desired date and time slot, select the commodities you wish to collect, and click ''Confirm Booking''. Your QR Code and receipt will be generated immediately.', 'अपने पोर्टल पर लॉग इन करें। ''स्लॉट बुक करें'' पर क्लिक करें, अपनी पसंद की तारीख और समय स्लॉट चुनें, उन वस्तुओं का चयन करें जिन्हें आप एकत्र करना चाहते हैं, और ''बुकिंग की पुष्टि करें'' पर क्लिक करें। आपका क्यूआर कोड और रसीद तुरंत उत्पन्न हो जाएगी।', 'మీ పోర్టల్‌లోకి లాగిన్ అవ్వండి. ''స్లాట్ బుక్ చేయి'' పై క్లిక్ చేయండి, మీకు కావలసిన తేదీ మరియు సమయం ఎంచుకోండి, సేకరించదలిచిన వస్తువులను ఎంచుకుని, ''బుకింగ్ నిర్ధారించు'' పై క్లిక్ చేయండి. మీ క్యూఆర్ కోడ్ మరియు రశీదు వెంటనే జనరేట్ అవుతుంది.'),
('Rescheduling', 'How to reschedule a missed slot?', 'छूटे हुए स्लॉट को दोबारा कैसे शेड्यूल करें?', 'మిస్ అయిన స్లాట్‌ను తిరిగి ఎలా షెడ్యూల్ చేయాలి?', 'If you miss your slot, the system marks it as MISSED. Go to your booking history, click the ''Reschedule'' button next to the missed slot, select a new date and time slot, and confirm.', 'यदि आप अपना स्लॉट चूक जाते हैं, तो सिस्टम इसे ''छूटा हुआ'' (MISSED) चिह्नित करता है। अपनी बुकिंग इतिहास पर जाएं, छूटे हुए स्लॉट के बगल में ''पुनः शेड्यूल करें'' (Reschedule) बटन पर क्लिक करें, नई तारीख और समय स्लॉट चुनें और पुष्टि करें।', 'మీరు మీ స్లాట్‌ను మిస్ అయితే, సిస్టమ్ దానిని ''MISSED'' గా మారుస్తుంది. మీ బుకింగ్ హిస్టరీలోకి వెళ్లి, మిస్ అయిన స్లాట్ పక్కన ఉన్న ''రీషెడ్యూల్'' బటన్ పై క్లిక్ చేసి, కొత్త తేదీ మరియు సమయాన్ని ఎంచుకుని కన్ఫర్మ్ చేయండి.'),
('FAQ', 'What happens if I miss my slot?', 'यदि मेरा स्लॉट छूट जाए तो क्या होगा?', 'నా స్లాట్ మిస్ అయితే ఏమవుతుంది?', 'Your booking will status update to ''MISSED''. Your ration will NOT be denied. You can reschedule the slot to any other available day in the same distribution period.', 'आपकी बुकिंग का स्टेटस बदलकर ''MISSED'' हो जाएगा। आपका राशन रोका नहीं जाएगा। आप उसी वितरण अवधि में किसी अन्य उपलब्ध दिन के लिए स्लॉट को दोबारा शेड्यूल कर सकते हैं।', 'మీ బుకింగ్ స్టేటస్ ''MISSED'' గా మారుతుంది. మీ రేషన్ నిరాకరించబడదు. అదే పంపిణీ వ్యవధిలో అందుబాటులో ఉన్న ఇతర రోజుకు మీరు స్లాట్‌ను రీషెడ్యూల్ చేసుకోవచ్చు.'),
('QR Code', 'How do I show my QR code?', 'मैं अपना क्यूआर कोड कैसे दिखाऊं?', 'నేను నా క్యూఆర్ కోడ్‌ను ఎలా చూపించాలి?', 'Once booked, your QR code appears directly on your beneficiary dashboard and booking history screen. Show this QR code on your mobile phone to the dealer when you visit the shop.', 'एक बार बुकिंग हो जाने के बाद, आपका क्यूआर कोड सीधे आपके लाभार्थी डैशबोर्ड और बुकिंग इतिहास स्क्रीन पर दिखाई देगा। दुकान पर जाने पर अपने मोबाइल फोन पर यह क्यूआर कोड डीलर को दिखाएं।', 'బుకింగ్ పూర్తయిన తర్వాత, మీ క్యూఆర్ కోడ్ నేరుగా మీ బెనిఫిషియరీ డ్యాష్‌బోర్డ్ మరియు బుకింగ్ హిస్టరీ స్క్రీన్‌పై కనిపిస్తుంది. షాపుకు వెళ్లినప్పుడు మీ మొబైల్‌లోని క్యూఆర్ కోడ్‌ను డీలర్‌కు చూపించండి.');

-- 10. Welcome Notifications
INSERT INTO notifications (user_id, title, message, type) VALUES 
(1, 'Welcome to Smart PDS!', 'You can now book, reschedule, and manage your ration collection slots online.', 'booking'),
(1, 'August Allocation Arrived', 'The government supply for August has been credited. Rice: 24kg, Wheat: 4kg, Sugar: 1kg.', 'stock');

-- 11. Initial Slots for Next 7 Days
INSERT INTO slots (ration_shop_id, date, time_slot, max_capacity, booked_count)
SELECT 
    shop_id,
    (CURRENT_DATE + d * INTERVAL '1 day')::DATE,
    slot_time,
    10,
    floor(random() * 5)::int
FROM 
    generate_series(0, 7) AS d,
    (VALUES 
        ('9:00 AM - 10:00 AM'),
        ('10:00 AM - 11:00 AM'),
        ('11:00 AM - 12:00 PM'),
        ('12:00 PM - 1:00 PM'),
        ('1:00 PM - 2:00 PM'),
        ('2:00 PM - 3:00 PM'),
        ('3:00 PM - 4:00 PM'),
        ('4:00 PM - 5:00 PM')
    ) AS t(slot_time),
    (VALUES (1), (2), (3)) AS s(shop_id)
ON CONFLICT (ration_shop_id, date, time_slot) DO NOTHING;

-- Synchronize sequence values with inserted IDs
SELECT setval('locations_id_seq', (SELECT COALESCE(MAX(id), 1) FROM locations));
SELECT setval('ration_shops_id_seq', (SELECT COALESCE(MAX(id), 1) FROM ration_shops));
SELECT setval('commodities_id_seq', (SELECT COALESCE(MAX(id), 1) FROM commodities));
SELECT setval('users_id_seq', (SELECT COALESCE(MAX(id), 1) FROM users));
SELECT setval('beneficiaries_id_seq', (SELECT COALESCE(MAX(id), 1) FROM beneficiaries));
SELECT setval('dealers_id_seq', (SELECT COALESCE(MAX(id), 1) FROM dealers));
SELECT setval('government_admins_id_seq', (SELECT COALESCE(MAX(id), 1) FROM government_admins));

-- ========================================================
-- PERMISSIONS FOR SUPABASE API & POSTGREST
-- ========================================================
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated;

-- Disable Row Level Security so backend API requests are permitted
ALTER TABLE IF EXISTS users DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS beneficiaries DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS dealers DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS government_admins DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS ration_shops DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS locations DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS commodities DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS shop_stocks DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS stock_transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS slots DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS bookings DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS booking_commodities DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS chatbot_faq DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS audit_logs DISABLE ROW LEVEL SECURITY;

