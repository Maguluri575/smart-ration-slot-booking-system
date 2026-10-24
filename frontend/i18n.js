// i18n.js - Comprehensive Multilingual Translation Engine & Global Navigation for Smart PDS
// Supports: English (en), Hindi (hi), Telugu (te)

window.PDS_LANGUAGES = {
  en: 'English',
  hi: 'हिंदी (Hindi)',
  te: 'తెలుగు (Telugu)'
};
var PDS_LANGUAGES = window.PDS_LANGUAGES;

// 1. Core Structured Translations Dictionary
window.translations = {
  en: {
    // Header & Global Navigation
    header_title: "SMART PDS",
    header_subtitle: "Govt. Public Distribution System",
    back_btn: "Back",
    back_to_hub: "Back to Portal Hub",
    back_to_signin: "Back to Sign In",
    system_online: "System Online · All Services Active",
    offline_mode: "You are currently offline. Running in offline-cached mode.",
    announcement_text: "Notice: Special allocation of supplementary oil and wheat distribution is now open for all AAY card holders until the 31st of August. Book slots now!",
    notifications_title: "Notifications",
    logout: "Logout",
    cancel: "Cancel",
    close: "Close",
    confirm: "Confirm",
    print: "Print Receipt",
    actions: "Actions",
    status: "Status",
    date: "Date",
    time: "Time Slot",
    quantity: "Quantity",
    commodity: "Commodity",
    portal: "Portal",

    // Landing Page
    hero_eyebrow: "Digital India Initiative · Ministry of Consumer Affairs",
    hero_title: "India's Smart Ration Distribution Portal",
    hero_subtitle: "A unified digital platform for citizens, licensed dealers, and government officers to manage Public Distribution System services with transparency and efficiency.",
    select_portal_heading: "Select Your Portal to Continue",
    citizen_portal_tag: "Citizen",
    citizen_portal_title: "User Portal",
    citizen_portal_cta: "Access Citizen Portal",
    dealer_portal_tag: "Licensed Dealer",
    dealer_portal_title: "Dealer Portal",
    dealer_portal_cta: "Access Dealer Portal",
    gov_portal_tag: "Govt. Admin",
    gov_portal_title: "Government Portal",
    gov_portal_cta: "Access Govt. Portal",
    notice_tag: "NOTICE",
    footer_rights: "© 2024 Government of India — Ministry of Consumer Affairs, Food & Public Distribution",
    ssl_secured: "SSL Secured",
    pwa_ready: "PWA Ready",
    ai_enabled: "AI-Enabled",

    // Auth & Portals
    role_beneficiary: "Citizen (User)",
    role_dealer: "FPS Dealer",
    role_admin: "Govt Admin",
    citizen_portal_name: "Citizen (User) Portal",
    dealer_portal_name: "FPS Dealer Portal",
    admin_portal_name: "Government Admin Portal",
    citizen_login_title: "Citizen Login",
    citizen_login_sub: "Enter your Ration Card Number and Password to access your ration booking services.",
    dealer_login_title: "FPS Dealer Login",
    dealer_login_sub: "Authorized Fair Price Shop Dealers access for queue check-in & ration distribution.",
    admin_login_title: "Government Administration Login",
    admin_login_sub: "State & District Civil Supplies Officers portal for allocation, supply chains & oversight.",
    citizen_badge: "Citizen PDS Portal",
    dealer_badge: "Fair Price Shop Portal",
    admin_badge: "Civil Supplies Department Portal",
    label_ration_card: "Ration Card Number",
    label_dealer_id: "Dealer ID / Shop Code",
    label_admin_id: "Government Admin ID / Officer Code",
    placeholder_ration_card: "e.g. RATION999 or 12-digit number",
    placeholder_dealer_id: "e.g. DEALER101",
    placeholder_admin_id: "e.g. ADMIN001",
    label_password: "Password",
    placeholder_password: "Enter your password",
    forgot_password: "Forgot Password?",
    quick_fill: "Quick Fill:",
    sign_in_citizen: "Sign In to Citizen Portal",
    sign_in_dealer: "Sign In to Dealer Portal",
    sign_in_admin: "Sign In to Government Portal",
    new_to_pds: "New to Smart PDS?",
    register_now: "Register Now",
    already_account: "Already have an account?",
    need_diff_portal: "Need a different portal?",
    go_portal_hub: "Go to Portal Selection Hub",
    reg_title: "New Citizen Registration",
    reg_subtitle: "Register your Ration Card Number to book slots and manage food grains.",
    label_reg_ration: "Ration Card Number *",
    hint_reg_ration: "Enter your official state ration card number",
    label_full_name: "Full Name (Head of Family) *",
    placeholder_full_name: "e.g. Ramesh Kumar",
    label_create_pass: "Create Password *",
    placeholder_create_pass: "Min 6 chars",
    label_confirm_pass: "Confirm Password *",
    placeholder_confirm_pass: "Re-enter password",
    label_mobile: "Mobile Number",
    placeholder_mobile: "e.g. 9876543210",
    mobile_hint: "Used for OTP verification and slot notifications",
    register_btn: "Register Citizen Account",
    dealer_notice_title: "Authorized FPS Dealers Only",
    dealer_notice_desc: "Dealer accounts are provisioned and audited by the District Civil Supplies Office. Public registration is not permitted.",
    gov_notice_title: "Restricted Government System",
    gov_notice_desc: "Access is restricted to authorized Food & Civil Supplies Department officers. All login activities are monitored.",
    forgot_title: "Password Recovery",
    forgot_desc: "Reset your portal password via mobile OTP verification.",
    label_forgot_user: "Ration Card No / User ID",
    send_otp: "Send OTP to Registered Mobile",
    enter_otp: "6-Digit OTP",
    new_password: "New Password",
    reset_password: "Reset Password",

    // Beneficiary Dashboard
    welcome: "Welcome",
    ration_card: "Ration Card",
    card_type: "Card Type",
    assigned_shop: "Assigned Shop",
    ward: "Ward",
    active_quota_status: "Active Quota Status",
    entitlements_title: "Monthly Quota & Shop Stock",
    my_quota: "My Quota",
    shop_status: "Shop Availability",
    action_title: "Slot Management",
    book_new_slot: "Book New Ration Slot",
    book_slot_desc: "Book your preferred date and time to collect monthly grains without standing in queues.",
    book_slot_btn: "Book Slot Now",
    offline_token_title: "Download Offline Token",
    offline_token_desc: "Generate encrypted offline SMS/QR token for low network areas.",
    get_offline_token: "Get Offline Token",
    upcoming_slot_title: "Active Upcoming Slot",
    reschedule_slot: "Reschedule Slot",
    cancel_booking: "Cancel Booking",
    view_receipt: "View Digital Receipt",
    history_title: "Booking History & Receipts",
    booking_id: "Booking ID",
    time_slot: "Time Slot",

    // Commodities & Units
    rice: "Rice",
    wheat: "Wheat",
    sugar: "Sugar",
    kerosene: "Kerosene",
    oil: "Edible Oil",
    in_stock: "In Stock",
    adequate: "Adequate",
    low_stock: "Low Stock",
    confirmed: "CONFIRMED",
    checked_in: "CHECKED IN",
    cancelled: "CANCELLED",
    expired: "EXPIRED",
    missed: "MISSED",

    // Dealer Portal
    dealer_portal: "Dealer Portal",
    today_booked: "Today's Bookings",
    today_distributed: "Completed Distributions",
    pending_users: "Pending Check-ins",
    missed_users: "Missed Slots",
    qr_checkin_title: "QR Verification & Check-in",
    enter_manual_id: "Enter Booking ID Manually",
    verify_checkin_btn: "Verify & Check-in",
    or_scanner: "-- OR --",
    start_scanner: "Start Camera Scanner",
    assisted_booking_title: "Assisted Slot Booking (for Elderly / Disabled)",
    assisted_name: "Beneficiary Name",
    assisted_ration: "Ration Card Number",
    assisted_mobile: "Mobile Number",
    create_booking_btn: "Create Assisted Booking",
    distribute_title: "Record Ration Distribution",
    beneficiary_details: "Beneficiary Details",
    quantities_distributed: "Quantities Distributed",
    rice_qty: "Rice Distributed (kg)",
    wheat_qty: "Wheat Distributed (kg)",
    sugar_qty: "Sugar Distributed (kg)",
    confirm_distribute_btn: "Confirm & Distribute Ration",
    todays_queue: "Today's Queue & Booking Registry",
    stock_mgmt_title: "Shop Stock Intake",
    gov_supply_ref: "Government Supply Reference Code",
    add_stock_btn: "Record Stock Intake",
    analytics_title: "Daily Distribution Analytics",
    crowd_monitor_title: "Live Crowd Monitoring — Shop Floor",
    persons: "Persons",
    low: "Low",
    moderate: "Moderate",
    high: "High",
    camera_off: "Camera Off",
    offline_lbl: "Offline",
    start_monitoring: "Start Monitoring",
    stop: "Stop",
    recent_log: "Recent Count Log",
    crowd_level: "Crowd Level",

    // Admin Portal
    admin_panel_title: "Civil Supplies Monitoring Panel",
    all_states: "All States",
    all_districts: "All Districts",
    all_regions: "All Regions",
    admin_kpi_total_ration: "Total Beneficiaries",
    admin_kpi_shops: "Active Fair Price Shops",
    admin_kpi_distributed: "Month Grains Dispatched",
    admin_kpi_efficiency: "PDS Distribution Efficiency",
    admin_supply_overview: "State Allocation & Supply Overview",
    admin_fps_registry: "Fair Price Shops Registry",
    add_fps_btn: "Add New FPS Shop",
    admin_audit_title: "AI Fraud Detection & Audit Alerts",

    // AI Chatbot
    bot_title: "PDS Sahayak (AI Assistant)",
    bot_subtitle: "Ask about your quota, slot timings, card eligibility, or shop locations.",
    bot_input_placeholder: "Type your query in English, Hindi, or Telugu...",
    send: "Send",

    // Modals
    booking_modal_title: "Schedule Your Ration Collection Slot",
    select_date: "1. Select Booking Date",
    select_time: "2. Select Time Slot & Estimate Crowd",
    crowd_estimation: "Crowd Level Estimation",
    select_commodities: "3. Select Commodities to Collect",
    confirm_booking: "Confirm Booking",
    receipt_title: "RATION BOOKING RECEIPT",
    qr_scanning_notice: "Dealer must scan this QR code for check-in",
    print_receipt: "Print Receipt"
  },

  hi: {
    // Header & Global Navigation
    header_title: "स्मार्ट पीडीएस",
    header_subtitle: "सरकारी सार्वजनिक वितरण प्रणाली",
    back_btn: "वापस जाएं",
    back_to_hub: "पोर्टल हब पर वापस जाएं",
    back_to_signin: "साइन इन पर वापस जाएं",
    system_online: "सिस्टम ऑनलाइन · सभी सेवाएं सक्रिय",
    offline_mode: "आप वर्तमान में ऑफ़लाइन हैं। ऑफ़लाइन-कैश्ड मोड में चल रहा है।",
    announcement_text: "सूचना: 31 अगस्त तक सभी अंत्योदय (AAY) कार्ड धारकों के लिए पूरक तेल और गेहूं का विशेष आवंटन खुला है। अभी स्लॉट बुक करें!",
    notifications_title: "सूचनाएं",
    logout: "लॉगआउट",
    cancel: "रद्द करें",
    close: "बंद करें",
    confirm: "पुष्टि करें",
    print: "रसीद प्रिंट करें",
    actions: "कार्रवाई",
    status: "स्थिति",
    date: "तारीख",
    time: "समय स्लॉट",
    quantity: "मात्रा",
    commodity: "वस्तु",
    portal: "पोर्टल",

    // Landing Page
    hero_eyebrow: "डिजिटल इंडिया पहल · उपभोक्ता मामले मंत्रालय",
    hero_title: "भारत का स्मार्ट राशन वितरण पोर्टल",
    hero_subtitle: "नागरिकों, लाइसेंस प्राप्त डीलरों और सरकारी अधिकारियों के लिए सार्वजनिक वितरण प्रणाली सेवाओं को पारदर्शी और कुशल तरीके से प्रबंधित करने का एकीकृत डिजिटल मंच।",
    select_portal_heading: "जारी रखने के लिए अपना पोर्टल चुनें",
    citizen_portal_tag: "नागरिक",
    citizen_portal_title: "नागरिक पोर्टल",
    citizen_portal_cta: "नागरिक पोर्टल खोलें",
    dealer_portal_tag: "लाइसेंस प्राप्त डीलर",
    dealer_portal_title: "डीलर पोर्टल",
    dealer_portal_cta: "डीलर पोर्टल खोलें",
    gov_portal_tag: "सरकारी व्यवस्थापक",
    gov_portal_title: "सरकारी पोर्टल",
    gov_portal_cta: "सरकारी पोर्टल खोलें",
    notice_tag: "सूचना",
    footer_rights: "© 2024 भारत सरकार — उपभोक्ता मामले, खाद्य और सार्वजनिक वितरण मंत्रालय",
    ssl_secured: "एसएसएल सुरक्षित",
    pwa_ready: "पीडबल्यूए तैयार",
    ai_enabled: "एआई सक्षम",

    // Auth & Portals
    role_beneficiary: "नागरिक (उपयोगकर्ता)",
    role_dealer: "उचित दर दुकान डीलर",
    role_admin: "सरकारी एडमिन",
    citizen_portal_name: "नागरिक (उपयोगकर्ता) पोर्टल",
    dealer_portal_name: "उचित दर दुकान डीलर पोर्टल",
    admin_portal_name: "सरकारी प्रशासन पोर्टल",
    citizen_login_title: "नागरिक लॉगिन",
    citizen_login_sub: "अपनी राशन बुकिंग सेवाओं तक पहुंचने के लिए अपना राशन कार्ड नंबर और पासवर्ड दर्ज करें।",
    dealer_login_title: "उचित दर दुकान डीलर लॉगिन",
    dealer_login_sub: "कतार चेक-इन और राशन वितरण के लिए अधिकृत उचित दर दुकान डीलरों का पोर्टल।",
    admin_login_title: "सरकारी प्रशासन लॉगिन",
    admin_login_sub: "आवंटन, आपूर्ति श्रृंखला और निगरानी के लिए राज्य और जिला नागरिक आपूर्ति अधिकारियों का पोर्टल।",
    citizen_badge: "नागरिक पीडीएस पोर्टल",
    dealer_badge: "उचित दर दुकान पोर्टल",
    admin_badge: "नागरिक आपूर्ति विभाग पोर्टल",
    label_ration_card: "राशन कार्ड नंबर",
    label_dealer_id: "डीलर आईडी / दुकान कोड",
    label_admin_id: "सरकारी एडमिन आईडी / अधिकारी कोड",
    placeholder_ration_card: "उदा. RATION999 या 12 अंकों का नंबर",
    placeholder_dealer_id: "उदा. DEALER101",
    placeholder_admin_id: "उदा. ADMIN001",
    label_password: "पासवर्ड",
    placeholder_password: "अपना पासवर्ड दर्ज करें",
    forgot_password: "पासवर्ड भूल गए?",
    quick_fill: "त्वरित भरें:",
    sign_in_citizen: "नागरिक पोर्टल में साइन इन करें",
    sign_in_dealer: "डीलर पोर्टल में साइन इन करें",
    sign_in_admin: "सरकारी पोर्टल में साइन इन करें",
    new_to_pds: "स्मार्ट पीडीएस में नए हैं?",
    register_now: "अभी पंजीकरण करें",
    already_account: "पहले से ही एक खाता है?",
    need_diff_portal: "कोई अन्य पोर्टल चाहिए?",
    go_portal_hub: "पोर्टल चयन हब पर जाएं",
    reg_title: "नया नागरिक पंजीकरण",
    reg_subtitle: "स्लॉट बुक करने और खाद्यान्न प्रबंधित करने के लिए अपना राशन कार्ड नंबर पंजीकृत करें।",
    label_reg_ration: "राशन कार्ड नंबर *",
    hint_reg_ration: "अपना आधिकारिक राज्य राशन कार्ड नंबर दर्ज करें",
    label_full_name: "पूरा नाम (परिवार का मुखिया) *",
    placeholder_full_name: "उदा. रमेश कुमार",
    label_create_pass: "पासवर्ड बनाएं *",
    placeholder_create_pass: "न्यूनतम 6 अक्षर",
    label_confirm_pass: "पासवर्ड की पुष्टि करें *",
    placeholder_confirm_pass: "पासवर्ड दोबारा दर्ज करें",
    label_mobile: "मोबाइल नंबर",
    placeholder_mobile: "उदा. 9876543210",
    mobile_hint: "ओटीपी सत्यापन और स्लॉट सूचनाओं के लिए उपयोग किया जाता है",
    register_btn: "नागरिक खाता पंजीकृत करें",
    dealer_notice_title: "केवल अधिकृत उचित दर डीलर",
    dealer_notice_desc: "डीलर खाते जिला नागरिक आपूर्ति कार्यालय द्वारा प्रदान और ऑडिट किए जाते हैं। सार्वजनिक पंजीकरण की अनुमति नहीं है।",
    gov_notice_title: "प्रतिबंधित सरकारी प्रणाली",
    gov_notice_desc: "खाद्य एवं नागरिक आपूर्ति विभाग के अधिकृत अधिकारियों तक ही पहुंच सीमित है। सभी लॉगिन गतिविधियों की निगरानी की जाती है।",
    forgot_title: "पासवर्ड पुनर्प्राप्ति",
    forgot_desc: "मोबाइल ओटीपी सत्यापन के माध्यम से अपना पोर्टल पासवर्ड रीसेट करें।",
    label_forgot_user: "राशन कार्ड नंबर / यूजर आईडी",
    send_otp: "पंजीकृत मोबाइल पर ओटीपी भेजें",
    enter_otp: "6-अंकीय ओटीपी",
    new_password: "नया पासवर्ड",
    reset_password: "पासवर्ड रीसेट करें",

    // Beneficiary Dashboard
    welcome: "स्वागत है",
    ration_card: "राशन कार्ड",
    card_type: "कार्ड प्रकार",
    assigned_shop: "आवंटित दुकान",
    ward: "वार्ड",
    active_quota_status: "सक्रिय कोटा स्थिति",
    entitlements_title: "मासिक कोटा और दुकान का स्टॉक",
    my_quota: "मेरा कोटा",
    shop_status: "दुकान में उपलब्धता",
    action_title: "स्लॉट प्रबंधन",
    book_new_slot: "नया राशन स्लॉट बुक करें",
    book_slot_desc: "कतारों में खड़े हुए बिना मासिक अनाज प्राप्त करने के लिए अपनी पसंदीदा तारीख और समय बुक करें।",
    book_slot_btn: "अभी स्लॉट बुक करें",
    offline_token_title: "ऑफ़लाइन टोकन डाउनलोड करें",
    offline_token_desc: "कम नेटवर्क वाले क्षेत्रों के लिए एन्क्रिप्टेड ऑफ़लाइन एसएमएस/क्यूआर टोकन उत्पन्न करें।",
    get_offline_token: "ऑफ़लाइन टोकन प्राप्त करें",
    upcoming_slot_title: "सक्रिय आगामी स्लॉट",
    reschedule_slot: "स्लॉट पुनर्निर्धारित करें",
    cancel_booking: "बुकिंग रद्द करें",
    view_receipt: "डिजिटल रसीद देखें",
    history_title: "बुकिंग इतिहास और रसीदें",
    booking_id: "बुकिंग आईडी",
    time_slot: "समय स्लॉट",

    // Commodities & Units
    rice: "चावल",
    wheat: "गेहूं",
    sugar: "चीनी",
    kerosene: "मिट्टी का तेल",
    oil: "खाद्य तेल",
    in_stock: "स्टॉक में उपलब्ध",
    adequate: "पर्याप्त",
    low_stock: "कम स्टॉक",
    confirmed: "पुष्ट (Confirmed)",
    checked_in: "चेक इन पूर्ण",
    cancelled: "रद्द (Cancelled)",
    expired: "समाप्त (Expired)",
    missed: "छूट गया (Missed)",

    // Dealer Portal
    dealer_portal: "डीलर पोर्टल",
    today_booked: "आज की कुल बुकिंग",
    today_distributed: "वितरण संपन्न",
    pending_users: "लंबित चेक-इन",
    missed_users: "छूटे हुए स्लॉट",
    qr_checkin_title: "क्यूआर सत्यापन और चेक-इन",
    enter_manual_id: "बुकिंग आईडी मैन्युअल रूप से दर्ज करें",
    verify_checkin_btn: "सत्यापित करें और चेक-इन करें",
    or_scanner: "-- या --",
    start_scanner: "कैमरा स्कैनर शुरू करें",
    assisted_booking_title: "सहायता प्राप्त स्लॉट बुकिंग (बुजुर्गों / दिव्यांगों के लिए)",
    assisted_name: "लाभार्थी का नाम",
    assisted_ration: "राशन कार्ड नंबर",
    assisted_mobile: "मोबाइल नंबर",
    create_booking_btn: "सहायता प्राप्त बुकिंग बनाएं",
    distribute_title: "राशन वितरण दर्ज करें",
    beneficiary_details: "लाभार्थी का विवरण",
    quantities_distributed: "वितरित मात्रा",
    rice_qty: "वितरित चावल (किग्रा)",
    wheat_qty: "वितरित गेहूं (किग्रा)",
    sugar_qty: "वितरित चीनी (किग्रा)",
    confirm_distribute_btn: "पुष्टि करें और राशन वितरित करें",
    todays_queue: "आज की कतार और बुकिंग रजिस्ट्री",
    stock_mgmt_title: "दुकान स्टॉक प्राप्ति",
    gov_supply_ref: "सरकारी आपूर्ति संदर्भ कोड",
    add_stock_btn: "स्टॉक प्राप्ति दर्ज करें",
    analytics_title: "दैनिक वितरण विश्लेषण",
    crowd_monitor_title: "लाइव भीड़ निगरानी — दुकान तल",
    persons: "व्यक्ति",
    low: "कम",
    moderate: "मध्यम",
    high: "अधिक",
    camera_off: "कैमरा बंद",
    offline_lbl: "ऑफ़लाइन",
    start_monitoring: "निगरानी शुरू करें",
    stop: "रोकें",
    recent_log: "हालिया गणना लॉग",
    crowd_level: "भीड़ का स्तर",

    // Admin Portal
    admin_panel_title: "नागरिक आपूर्ति निगरानी पैनल",
    all_states: "सभी राज्य",
    all_districts: "सभी जिले",
    all_regions: "सभी क्षेत्र",
    admin_kpi_total_ration: "कुल लाभार्थी",
    admin_kpi_shops: "सक्रिय उचित दर दुकानें",
    admin_kpi_distributed: "इस माह अनाज वितरित",
    admin_kpi_efficiency: "वितरण दक्षता",
    admin_supply_overview: "राज्य आवंटन एवं आपूर्ति अवलोकन",
    admin_fps_registry: "उचित दर दुकान रजिस्ट्री",
    add_fps_btn: "नई दुकान जोड़ें",
    admin_audit_title: "एआई धोखाधड़ी पहचान एवं ऑडिट अलर्ट",

    // AI Chatbot
    bot_title: "पीडीएस सहायक (एआई सहायक)",
    bot_subtitle: "अपने कोटे, स्लॉट के समय, कार्ड की पात्रता या दुकान के स्थानों के बारे में पूछें।",
    bot_input_placeholder: "हिंदी, अंग्रेजी या तेलुगु में पूछें...",
    send: "भेजें",

    // Modals
    booking_modal_title: "अपने राशन संग्रह स्लॉट को शेड्यूल करें",
    select_date: "1. बुकिंग की तारीख चुनें",
    select_time: "2. समय स्लॉट चुनें और भीड़ का अनुमान लगाएं",
    crowd_estimation: "भीड़ स्तर का अनुमान",
    select_commodities: "3. लेने के लिए अनाज/सामग्री चुनें",
    confirm_booking: "बुकिंग की पुष्टि करें",
    receipt_title: "राशन बुकिंग रसीद",
    qr_scanning_notice: "चेक-इन के लिए डीलर को यह क्यूआर कोड स्कैन करना होगा",
    print_receipt: "रसीद प्रिंट करें"
  },

  te: {
    // Header & Global Navigation
    header_title: "స్మార్ట్ పిడిఎస్",
    header_subtitle: "ప్రభుత్వ ప్రజా పంపిణీ వ్యవస్థ",
    back_btn: "వెనుకకు",
    back_to_hub: "పోర్టల్ హబ్‌కు తిరిగి వెళ్లండి",
    back_to_signin: "లాగిన్‌కు తిరిగి వెళ్ళండి",
    system_online: "సిస్టమ్ ఆన్‌లైన్ · అన్ని సేవలు పనిచేస్తున్నాయి",
    offline_mode: "మీరు ప్రస్తుతం ఆఫ్‌లైన్‌లో ఉన్నారు. ఆఫ్‌లైన్ కాష్ మోడ్‌లో నడుస్తోంది.",
    announcement_text: "గమనిక: ఆగస్టు 31 వరకు అన్ని AAY కార్డుదారులకు అదనపు నూనె మరియు గోధుమల పంపిణీ అందుబాటులో ఉంది. ఇప్పుడే స్లాట్ బుక్ చేయండి!",
    notifications_title: "నోటిఫికేషన్లు",
    logout: "లాగ్అవుట్",
    cancel: "రద్దు చేయి",
    close: "మూసివేయి",
    confirm: "ధృవీకరించు",
    print: "రశీదు ప్రింట్ చేయి",
    actions: "చర్యలు",
    status: "స్థితి",
    date: "తేదీ",
    time: "సమయం స్లాట్",
    quantity: "పరిమాణం",
    commodity: "వస్తువు",
    portal: "పోర్టల్",

    // Landing Page
    hero_eyebrow: "డిజిటల్ ఇండియా చొరవ · వినియోగదారుల వ్యవహారాల మంత్రిత్వ శాఖ",
    hero_title: "భారతదేశపు స్మార్ట్ రేషన్ పంపిణీ పోర్టల్",
    hero_subtitle: "పౌరులు, లైసెన్స్ పొందిన డీలర్లు మరియు ప్రభుత్వ అధికారులు ప్రజా పంపిణీ వ్యవస్థ సేవలను పారదర్శకంగా మరియు సమర్థవంతంగా నిర్వహించడానికి ఒక సమగ్ర డిజిటల్ వేదిక.",
    select_portal_heading: "కొనసాగడానికి మీ పోర్టల్‌ను ఎంచుకోండి",
    citizen_portal_tag: "పౌరుడు",
    citizen_portal_title: "యూజర్ పోర్టల్",
    citizen_portal_cta: "సిటిజన్ పోర్టల్ ప్రవేశించండి",
    dealer_portal_tag: "లైసెన్స్డ్ డీలర్",
    dealer_portal_title: "డీలర్ పోర్టల్",
    dealer_portal_cta: "డీలర్ పోర్టల్ ప్రవేశించండి",
    gov_portal_tag: "ప్రభుత్వ అడ్మిన్",
    gov_portal_title: "ప్రభుత్వ పోర్టల్",
    gov_portal_cta: "ప్రభుత్వ పోర్టల్ ప్రవేశించండి",
    notice_tag: "గమనిక",
    footer_rights: "© 2024 భారత ప్రభుత్వం — వినియోగదారుల వ్యవహారాలు, ఆహార & ప్రజా పంపిణీ మంత్రిత్వ శాఖ",
    ssl_secured: "SSL సురక్షితం",
    pwa_ready: "PWA సిద్ధంగా ఉంది",
    ai_enabled: "AI ఆధారితం",

    // Auth & Portals
    role_beneficiary: "పౌరుడు (వినియోగదారు)",
    role_dealer: "FPS డీలర్",
    role_admin: "ప్రభుత్వ అడ్మిన్",
    citizen_portal_name: "సిటిజన్ (యూజర్) పోర్టల్",
    dealer_portal_name: "FPS డీలర్ పోర్టల్",
    admin_portal_name: "ప్రభుత్వ పరిపాలన పోర్టల్",
    citizen_login_title: "సిటిజన్ లాగిన్",
    citizen_login_sub: "మీ రేషన్ బుకింగ్ సేవలను పొందడానికి మీ రేషన్ కార్డు నంబర్ మరియు పాస్‌వర్డ్ నమోదు చేయండి.",
    dealer_login_title: "FPS డీలర్ లాగిన్",
    dealer_login_sub: "క్యూ చెక్-ఇన్ మరియు రేషన్ పంపిణీ కోసం అధీకృత చౌక ధరల దుకాణం డీలర్ల పోర్టల్.",
    admin_login_title: "ప్రభుత్వ పరిపాలన లాగిన్",
    admin_login_sub: "కేటాయింపులు, సరఫరా గొలుసు మరియు పర్యవేక్షణ కోసం రాష్ట్ర & జిల్లా పౌర సరఫరాల అధికారుల పోర్టల్.",
    citizen_badge: "సిటిజన్ పిడిఎస్ పోర్టల్",
    dealer_badge: "ఫెయిర్ ప్రైస్ షాప్ పోర్టల్",
    admin_badge: "పౌర సరఫరాల శాఖ పోర్టల్",
    label_ration_card: "రేషన్ కార్డు నంబరు",
    label_dealer_id: "డీలర్ ఐడి / షాప్ కోడ్",
    label_admin_id: "ప్రభుత్వ అడ్మిన్ ఐడి / ఆఫీసర్ కోడ్",
    placeholder_ration_card: "ఉదా. RATION999 లేదా 12 అంకెల సంఖ్య",
    placeholder_dealer_id: "ఉదా. DEALER101",
    placeholder_admin_id: "ఉదా. ADMIN001",
    label_password: "పాస్‌వర్డ్",
    placeholder_password: "మీ పాస్‌వర్డ్‌ను నమోదు చేయండి",
    forgot_password: "పాస్‌వర్డ్ మర్చిపోయారా?",
    quick_fill: "త్వరిత పూరణ:",
    sign_in_citizen: "సిటిజన్ పోర్టల్‌లోకి లాగిన్ అవ్వండి",
    sign_in_dealer: "డీలర్ పోర్టల్‌లోకి లాగిన్ అవ్వండి",
    sign_in_admin: "ప్రభుత్వ పోర్టల్‌లోకి లాగిన్ అవ్వండి",
    new_to_pds: "స్మార్ట్ పిడిఎస్‌కు కొత్తవారా?",
    register_now: "ఇప్పుడే నమోదు చేసుకోండి",
    already_account: "ఇప్పటికే ఖాతా ఉందా?",
    need_diff_portal: "మరొక పోర్టల్ కావాలా?",
    go_portal_hub: "పోర్టల్ సెలక్షన్ హబ్‌కు వెళ్లండి",
    reg_title: "కొత్త పౌరుడి నమోదు",
    reg_subtitle: "స్లాట్లను బుక్ చేసుకోవడానికి మరియు ఆహార ధాన్యాలను నిర్వహించడానికి మీ రేషన్ కార్డు నంబరును నమోదు చేసుకోండి.",
    label_reg_ration: "రేషన్ కార్డు నంబరు *",
    hint_reg_ration: "మీ అధికారిక రాష్ట్ర రేషన్ కార్డు నంబరును నమోదు చేయండి",
    label_full_name: "పూర్తి పేరు (కుటుంబ పెద్ద) *",
    placeholder_full_name: "ఉదా. రమేష్ కుమార్",
    label_create_pass: "పాస్‌వర్డ్ సృష్టించండి *",
    placeholder_create_pass: "కనీసం 6 అక్షరాలు",
    label_confirm_pass: "పాస్‌వర్డ్‌ను నిర్ధారించండి *",
    placeholder_confirm_pass: "పాస్‌వర్డ్‌ను తిరిగి నమోదు చేయండి",
    label_mobile: "మొబైల్ నంబరు",
    placeholder_mobile: "ఉదా. 9876543210",
    mobile_hint: "ఓటిపి ధృవీకరణ మరియు స్లాట్ నోటిఫికేషన్ల కోసం ఉపయోగించబడుతుంది",
    register_btn: "పౌరుడి ఖాతాను నమోదు చేయండి",
    dealer_notice_title: "అధీకృత FPS డీలర్లు మాత్రమే",
    dealer_notice_desc: "డీలర్ ఖాతాలు జిల్లా పౌర సరఫరాల కార్యాలయం ద్వారా అందించబడతాయి మరియు తనిఖీ చేయబడతాయి. పబ్లిక్ రిజిస్ట్రేషన్ అనుమతించబడదు.",
    gov_notice_title: "పరిమిత ప్రభుత్వ వ్యవస్థ",
    gov_notice_desc: "ఆహార & పౌర సరఫరాల శాఖ అధికారులకు మాత్రమే ప్రవేశం పరిమితం చేయబడింది. అన్ని లాగిన్ కార్యకలాపాలు పర్యవేక్షించబడతాయి.",
    forgot_title: "పాస్‌వర్డ్ రికవరీ",
    forgot_desc: "మొబైల్ ఓటిపి ధృవీకరణ ద్వారా మీ పోర్టల్ పాస్‌వర్డ్‌ను రీసెట్ చేయండి.",
    label_forgot_user: "రేషన్ కార్డు నంబర్ / యూజర్ ఐడి",
    send_otp: "నమోదిత మొబైల్‌కు ఓటిపి పంపండి",
    enter_otp: "6-అంకెల ఓటిపి",
    new_password: "కొత్త పాస్‌వర్డ్",
    reset_password: "పాస్‌వర్డ్ రీసెట్ చేయి",

    // Beneficiary Dashboard
    welcome: "స్వాగతం",
    ration_card: "రేషన్ కార్డు",
    card_type: "కార్డు రకం",
    assigned_shop: "కేటాయించిన షాప్",
    ward: "వార్డు",
    active_quota_status: "సక్రియ కోటా స్థితి",
    entitlements_title: "నెలవారీ కోటా & షాప్ స్టాక్",
    my_quota: "నా కోటా",
    shop_status: "షాపులో లభ్యత",
    action_title: "స్లాట్ నిర్వహణ",
    book_new_slot: "కొత్త రేషన్ స్లాట్ బుక్ చేయండి",
    book_slot_desc: "క్యూలలో నిలబడకుండా నెలవారీ ధాన్యాలు సేకరించడానికి మీకు నచ్చిన తేదీ మరియు సమయాన్ని బుక్ చేసుకోండి.",
    book_slot_btn: "ఇప్పుడే స్లాట్ బుక్ చేయండి",
    offline_token_title: "ఆఫ్‌లైన్ టోకెన్ డౌన్‌లోడ్ చేయండి",
    offline_token_desc: "తక్కువ నెట్‌వర్క్ ఉన్న ప్రాంతాల కోసం ఎన్‌క్రిప్టెడ్ ఆఫ్‌లైన్ SMS/QR టోకెన్‌ను పొందండి.",
    get_offline_token: "ఆఫ్‌లైన్ టోకెన్ పొందండి",
    upcoming_slot_title: "ప్రస్తుత బుకింగ్ స్లాట్",
    reschedule_slot: "స్లాట్‌ను రీషెడ్యూల్ చేయండి",
    cancel_booking: "బుకింగ్ రద్దు చేయండి",
    view_receipt: "డిజిటల్ రశీదు చూడండి",
    history_title: "బుకింగ్ చరిత్ర & రశీదులు",
    booking_id: "బుకింగ్ ఐడి",
    time_slot: "సమయం స్లాట్",

    // Commodities & Units
    rice: "బియ్యం",
    wheat: "గోధుమలు",
    sugar: "చక్కెర",
    kerosene: "కిరోసిన్",
    oil: "వంట నూనె",
    in_stock: "స్టాక్‌లో ఉంది",
    adequate: "సరిపడా ఉంది",
    low_stock: "తక్కువ స్టాక్",
    confirmed: "ధృవీకరించబడింది (Confirmed)",
    checked_in: "చెక్-ఇన్ పూర్తయింది",
    cancelled: "రద్దు చేయబడింది (Cancelled)",
    expired: "గడువు ముగిసింది (Expired)",
    missed: "మిస్ అయింది (Missed)",

    // Dealer Portal
    dealer_portal: "డీలర్ పోర్టల్",
    today_booked: "ఈ రోజు బుకింగ్‌లు",
    today_distributed: "పంపిణీ పూర్తయినవి",
    pending_users: "వేచి ఉన్న చెక్-ఇన్‌లు",
    missed_users: "మిస్ అయిన స్లాట్లు",
    qr_checkin_title: "క్యూఆర్ ధృవీకరణ & చెక్-ఇన్",
    enter_manual_id: "బుకింగ్ ఐడిని నమోదు చేయండి",
    verify_checkin_btn: "ధృవీకరించి చెక్-ఇన్ చేయండి",
    or_scanner: "-- లేదా --",
    start_scanner: "కెమెరా స్కానర్ ప్రారంభించండి",
    assisted_booking_title: "సహాయక స్లాట్ బుకింగ్ (వృద్ధులు / వికలాంగుల కోసం)",
    assisted_name: "లబ్ధిదారుని పేరు",
    assisted_ration: "రేషన్ కార్డు నంబరు",
    assisted_mobile: "మొబైల్ నంబరు",
    create_booking_btn: "సహాయక బుకింగ్ సృష్టించండి",
    distribute_title: "రేషన్ పంపిణీని నమోదు చేయండి",
    beneficiary_details: "లబ్ధిదారుని వివరాలు",
    quantities_distributed: "పంపిణీ చేసిన పరిమాణం",
    rice_qty: "పంపిణీ చేసిన బియ్యం (కేజీ)",
    wheat_qty: "పంపిణీ చేసిన గోధుమలు (కేజీ)",
    sugar_qty: "పంపిణీ చేసిన చక్కెర (కేజీ)",
    confirm_distribute_btn: "ధృవీకరించి రేషన్ పంపిణీ చేయండి",
    todays_queue: "ఈ రోజు క్యూ & బుకింగ్ రిజిస్టర్",
    stock_mgmt_title: "షాప్ స్టాక్ ఇన్ టేక్",
    gov_supply_ref: "ప్రభుత్వ సరఫరా రిఫరెన్స్ కోడ్",
    add_stock_btn: "స్టాక్ ఇన్ టేక్ నమోదు చేయండి",
    analytics_title: "రోజువారీ పంపిణీ విశ్లేషణ",
    crowd_monitor_title: "లైవ్ రద్దీ పర్యవేక్షణ — షాప్ ఫ్లోర్",
    persons: "వ్యక్తులు",
    low: "తక్కువ",
    moderate: "మధ్యస్థం",
    high: "ఎక్కువ",
    camera_off: "కెమెరా ఆఫ్‌లో ఉంది",
    offline_lbl: "ఆఫ్‌లైన్",
    start_monitoring: "పర్యవేక్షణ ప్రారంభించు",
    stop: "ఆపు",
    recent_log: "ఇటీవలి గణన లాగ్",
    crowd_level: "రద్దీ స్థాయి",

    // Admin Portal
    admin_panel_title: "పౌర సరఫరాల పర్యవేక్షణ ప్యానెల్",
    all_states: "అన్ని రాష్ట్రాలు",
    all_districts: "అన్ని జిల్లాలు",
    all_regions: "అన్ని ప్రాంతాలు",
    admin_kpi_total_ration: "మొత్తం లబ్ధిదారులు",
    admin_kpi_shops: "సక్రియ ఫెయిర్ ప్రైస్ షాపులు",
    admin_kpi_distributed: "ఈ నెల పంపిణీ అయిన ధాన్యాలు",
    admin_kpi_efficiency: "పంపిణీ సామర్థ్యం",
    admin_supply_overview: "రాష్ట్ర కేటాయింపులు & సరఫరా పరిశీలన",
    admin_fps_registry: "ఫెయిర్ ప్రైస్ షాపుల రిజిస్ట్రీ",
    add_fps_btn: "కొత్త షాపును జోడించండి",
    admin_audit_title: "AI మోసాల గుర్తింపు & ఆడిట్ హెచ్చరికలు",

    // AI Chatbot
    bot_title: "పిడిఎస్ సహాయక్ (AI అసిస్టెంట్)",
    bot_subtitle: "మీ కోటా, స్లాట్ సమయాలు, కార్డు అర్హత లేదా షాప్ వివరాల గురించి అడగండి.",
    bot_input_placeholder: "తెలుగు, ఇంగ్లీష్ లేదా హిందీలో అడగండి...",
    send: "పంపు",

    // Modals
    booking_modal_title: "మీ రేషన్ సేకరణ స్లాట్‌ను షెడ్యూల్ చేయండి",
    select_date: "1. బుకింగ్ తేదీని ఎంచుకోండి",
    select_time: "2. స్లాట్ సమయం ఎంచుకుని రద్దీని అంచనా వేయండి",
    crowd_estimation: "రద్దీ స్థాయి అంచనా",
    select_commodities: "3. సేకరించాల్సిన వస్తువులను ఎంచుకోండి",
    confirm_booking: "బుకింగ్‌ను నిర్ధారించండి",
    receipt_title: "రేషన్ బుకింగ్ రశీదు",
    qr_scanning_notice: "డీలర్ చెక్-ఇన్ కోసం ఈ క్యూఆర్ కోడ్‌ను స్కాన్ చేయాలి",
    print_receipt: "రశీదు ప్రింట్ చేయండి"
  }
};

// 2. Comprehensive Phrase Translation Mapping for Word-for-Word Text Replacement
window.phraseDictionary = {
  // Navigation & Buttons
  "Back": { hi: "वापस जाएं", te: "వెనుకకు" },
  "Back to Portal Hub": { hi: "पोर्टल हब पर वापस जाएं", te: "పోర్టల్ హబ్‌కు తిరిగి వెళ్లండి" },
  "Back to Sign In": { hi: "साइन इन पर वापस जाएं", te: "లాగిన్‌కు తిరిగి వెళ్ళండి" },
  "Go to Portal Selection Hub": { hi: "पोर्टल चयन हब पर जाएं", te: "పోర్టల్ సెలక్షన్ హబ్‌కు వెళ్లండి" },
  "Need a different portal?": { hi: "कोई अन्य पोर्टल चाहिए?", te: "మరొక పోర్టల్ కావాలా?" },
  "Close": { hi: "बंद करें", te: "మూసివేయి" },
  "Cancel": { hi: "रद्द करें", te: "రద్దు చేయి" },
  "Confirm": { hi: "पुष्टि करें", te: "ధృవీకరించు" },
  "Print Receipt": { hi: "रसीद प्रिंट करें", te: "రశీదు ప్రింట్ చేయండి" },
  "Logout": { hi: "लॉगआउट", te: "లాగ్అవుట్" },
  "Quick Fill:": { hi: "त्वरित भरें:", te: "త్వరిత పూరణ:" },
  "SSL 256-bit Encrypted": { hi: "एसएसएल 256-बिट एन्क्रिप्टेड", te: "SSL 256-బిట్ ఎన్‌క్రిప్టెడ్" },

  // Portal Titles & Headers
  "SMART PDS": { hi: "स्मार्ट पीडीएस", te: "స్మార్ట్ పిడిఎస్" },
  "Govt. Public Distribution System": { hi: "सरकारी सार्वजनिक वितरण प्रणाली", te: "ప్రభుత్వ ప్రజా పంపిణీ వ్యవస్థ" },
  "Citizen (User)": { hi: "नागरिक (उपयोगकर्ता)", te: "పౌరుడు (వినియోగదారు)" },
  "Citizen (User) Portal": { hi: "नागरिक (उपयोगकर्ता) पोर्टल", te: "సిటిజన్ (యూజర్) పోర్టల్" },
  "FPS Dealer": { hi: "उचित दर दुकान डीलर", te: "FPS డీలర్" },
  "FPS Dealer Portal": { hi: "उचित दर दुकान डीलर पोर्टल", te: "FPS డీలర్ పోర్టల్" },
  "Govt Admin": { hi: "सरकारी एडमिन", te: "ప్రభుత్వ అడ్మిన్" },
  "Govt Admin Portal": { hi: "सरकारी एडमिन पोर्टल", te: "ప్రభుత్వ అడ్మిన్ పోర్టల్" },
  "Government Admin Portal": { hi: "सरकारी प्रशासन पोर्टल", te: "ప్రభుత్వ పరిపాలన పోర్టల్" },
  "Citizen Login": { hi: "नागरिक लॉगिन", te: "సిటిజన్ లాగిన్" },
  "FPS Dealer Login": { hi: "उचित दर दुकान डीलर लॉगिन", te: "FPS డీలర్ లాగిన్" },
  "Government Administration Login": { hi: "सरकारी प्रशासन लॉगिन", te: "ప్రభుత్వ పరిపాలన లాగిన్" },
  "Citizen PDS Portal": { hi: "नागरिक पीडीएस पोर्टल", te: "సిటిజన్ పిడిఎస్ పోర్టల్" },
  "Fair Price Shop Portal": { hi: "उचित दर दुकान पोर्टल", te: "ఫెయిర్ ప్రైస్ షాప్ పోర్టల్" },
  "Civil Supplies Department Portal": { hi: "नागरिक आपूर्ति विभाग पोर्टल", te: "పౌర సరఫరాల శాఖ పోర్టల్" },

  // Landing Page
  "Digital India Initiative · Ministry of Consumer Affairs": { hi: "डिजिटल इंडिया पहल · उपभोक्ता मामले मंत्रालय", te: "డిజిటల్ ఇండియా చొరవ · వినియోగదారుల వ్యవహారాల మంత్రిత్వ శాఖ" },
  "Digital India Initiative  ·  Ministry of Consumer Affairs": { hi: "डिजिटल इंडिया पहल · उपभोक्ता मामले मंत्रालय", te: "డిజిటల్ ఇండియా చొరవ · వినియోగదారుల వ్యవహారాల మంత్రిత్వ శాఖ" },
  "India's Smart Ration Distribution Portal": { hi: "भारत का स्मार्ट राशन वितरण पोर्टल", te: "భారతదేశపు స్మార్ట్ రేషన్ పంపిణీ పోర్టల్" },
  "System Online · All Services Active": { hi: "सिस्टम ऑनलाइन · सभी सेवाएं सक्रिय", te: "సిస్టమ్ ఆన్‌లైన్ · అన్ని సేవలు పనిచేస్తున్నాయి" },
  "System Online  ·  All Services Active": { hi: "सिस्टम ऑनलाइन · सभी सेवाएं सक्रिय", te: "సిస్టమ్ ఆన్‌లైన్ · అన్ని సేవలు పనిచేస్తున్నాయి" },
  "Select Your Portal to Continue": { hi: "जारी रखने के लिए अपना पोर्टल चुनें", te: "కొనసాగడానికి మీ పోర్టల్‌ను ఎంచుకోండి" },
  "Citizen": { hi: "नागरिक", te: "పౌరుడు" },
  "User Portal": { hi: "नागरिक पोर्टल", te: "యూజర్ పోర్టల్" },
  "Access Citizen Portal": { hi: "नागरिक पोर्टल खोलें", te: "సిటిజన్ పోర్టల్ ప్రవేశించండి" },
  "Licensed Dealer": { hi: "लाइसेंस प्राप्त डीलर", te: "లైసెన్స్డ్ డీలర్" },
  "Dealer Portal": { hi: "डीलर पोर्टल", te: "డీలర్ పోర్టల్" },
  "Access Dealer Portal": { hi: "डीलर पोर्टल खोलें", te: "డీలర్ పోర్టల్ ప్రవేశించండి" },
  "Govt. Admin": { hi: "सरकारी व्यवस्थापक", te: "ప్రభుత్వ అడ్మిన్" },
  "Government Portal": { hi: "सरकारी पोर्टल", te: "ప్రభుత్వ పోర్టల్" },
  "Access Govt. Portal": { hi: "सरकारी पोर्टल खोलें", te: "ప్రభుత్వ పోర్టల్ ప్రవేశించండి" },
  "NOTICE": { hi: "सूचना", te: "గమనిక" },
  "SSL Secured": { hi: "एसएसएल सुरक्षित", te: "SSL సురక్షితం" },
  "PWA Ready": { hi: "पीडबल्यूए तैयार", te: "PWA సిద్ధంగా ఉంది" },
  "AI-Enabled": { hi: "एआई सक्षम", te: "AI ఆధారితం" },

  // Forms & Auth
  "Ration Card Number": { hi: "राशन कार्ड नंबर", te: "రేషన్ కార్డు నంబరు" },
  "Dealer ID / Shop Code": { hi: "डीलर आईडी / दुकान कोड", te: "డీలర్ ఐడి / షాప్ కోడ్" },
  "Government Admin ID / Officer Code": { hi: "सरकारी एडमिन आईडी / अधिकारी कोड", te: "ప్రభుత్వ అడ్మిన్ ఐడి / ఆఫీసర్ కోడ్" },
  "Password": { hi: "पासवर्ड", te: "పాస్‌వర్డ్" },
  "Enter your password": { hi: "अपना पासवर्ड दर्ज करें", te: "మీ పాస్‌వర్డ్ నమోదు చేయండి" },
  "Forgot Password?": { hi: "पासवर्ड भूल गए?", te: "పాస్‌వర్డ్ మర్చిపోయారా?" },
  "Remember Me": { hi: "मुझे याद रखें", te: "నన్ను గుర్తుంచుకో" },
  "New to Smart PDS?": { hi: "स्मार्ट पीडीएस में नए हैं?", te: "స్మార్ట్ పిడిఎస్‌కి కొత్తవారా?" },
  "Already have an account?": { hi: "पहले से ही खाता है?", te: "ఇప్పటికే ఖాతా ఉందా?" },
  "Invalid password credentials.": { hi: "अमान्य पासवर्ड क्रेडेंशियल।", te: "చెల్లని పాస్‌వర్డ్ ఆధారాలు." },
  "Invalid credentials": { hi: "अमान्य क्रेडेंशियल", te: "చెల్లని ఆధారాలు" },
  "Enter your official state ration card number": { hi: "अपना आधिकारिक राज्य राशन कार्ड नंबर दर्ज करें", te: "మీ అధికారిక రాష్ట్ర రేషన్ కార్డు నంబర్‌ను నమోదు చేయండి" },
  "Used for OTP verification and slot notifications": { hi: "ओटीपी सत्यापन और स्लॉट सूचनाओं के लिए उपयोग किया जाता है", te: "ఓటిపి ధృవీకరణ మరియు స్లాట్ నోటిఫికేషన్‌ల కోసం ఉపయోగించబడుతుంది" },
  "Min 6 chars": { hi: "न्यूनतम 6 अक्षर", te: "కనీసం 6 అక్షరాలు" },
  "Re-enter password": { hi: "पासवर्ड दोबारा दर्ज करें", te: "పాస్‌వర్డ్‌ను మళ్లీ నమోదు చేయండి" },
  "Sign In to Citizen Portal": { hi: "नागरिक पोर्टल में साइन इन करें", te: "సిటిజన్ పోర్టల్‌లోకి లాగిన్ అవ్వండి" },
  "Sign In to Dealer Portal": { hi: "डीलर पोर्टल में साइन इन करें", te: "డీలర్ పోర్టల్‌లోకి లాగిన్ అవ్వండి" },
  "Sign In to Government Portal": { hi: "सरकारी पोर्टल में साइन इन करें", te: "ప్రభుత్వ పోర్టల్‌లోకి లాగిన్ అవ్వండి" },
  "Register Now": { hi: "अभी पंजीकरण करें", te: "ఇప్పుడే నమోదు చేసుకోండి" },
  "New Citizen Registration": { hi: "नया नागरिक पंजीकरण", te: "కొత్త పౌరుడి నమోదు" },
  "Ration Card Number *": { hi: "राशन कार्ड नंबर *", te: "రేషన్ కార్డు నంబరు *" },
  "Full Name (Head of Family) *": { hi: "पूरा नाम (परिवार का मुखिया) *", te: "పూర్తి పేరు (కుటుంబ పెద్ద) *" },
  "Create Password *": { hi: "पासवर्ड बनाएं *", te: "పాస్‌వర్డ్ సృష్టించండి *" },
  "Confirm Password *": { hi: "पासवर्ड की पुष्टि करें *", te: "పాస్‌వర్డ్‌ను నిర్ధారించండి *" },
  "Mobile Number": { hi: "मोबाइल नंबर", te: "మొబైల్ నంబరు" },
  "Register Citizen Account": { hi: "नागरिक खाता पंजीकृत करें", te: "పౌరుడి ఖాతాను నమోదు చేయండి" },
  "Password Recovery": { hi: "पासवर्ड पुनर्प्राप्ति", te: "పాస్‌వర్డ్ రికవరీ" },
  "Send OTP to Registered Mobile": { hi: "पंजीकृत मोबाइल पर ओटीपी भेजें", te: "నమోదిత మొబైల్‌కు ఓటిపి పంపండి" },
  "6-Digit OTP": { hi: "6-अंकीय ओटीपी", te: "6-అంకెల ఓటిపి" },
  "New Password": { hi: "नया पासवर्ड", te: "కొత్త పాస్‌వర్డ్" },
  "Reset Password": { hi: "पासवर्ड रीसेट करें", te: "పాస్‌వర్డ్ రీసెట్ చేయి" },

  // Beneficiary Dashboard
  "Welcome": { hi: "स्वागत है", te: "స్వాగతం" },
  "Ration Card": { hi: "राशन कार्ड", te: "రేషన్ కార్డు" },
  "Card Type": { hi: "कार्ड प्रकार", te: "కార్డు రకం" },
  "Assigned Shop": { hi: "आवंटित दुकान", te: "కేటాయించిన షాప్" },
  "Ward": { hi: "वार्ड", te: "వార్డు" },
  "Monthly Quota & Shop Stock": { hi: "मासिक कोटा और दुकान का स्टॉक", te: "నెలవారీ కోటా & షాప్ స్టాక్" },
  "Commodity": { hi: "वस्तु", te: "వస్తువు" },
  "My Quota": { hi: "मेरा कोटा", te: "నా కోటా" },
  "Shop Availability": { hi: "दुकान में उपलब्धता", te: "షాపులో లభ్యత" },
  "Slot Management": { hi: "स्लॉट प्रबंधन", te: "స్లాట్ నిర్వహణ" },
  "Book New Ration Slot": { hi: "नया राशन स्लॉट बुक करें", te: "కొత్త రేషన్ స్లాట్ బుక్ చేయండి" },
  "Book Slot Now": { hi: "अभी स्लॉट बुक करें", te: "ఇప్పుడే స్లాట్ బుక్ చేయండి" },
  "Download Offline Token": { hi: "ऑफ़लाइन टोकन डाउनलोड करें", te: "ఆఫ్‌లైన్ టోకెన్ డౌన్‌లోడ్ చేయండి" },
  "Get Offline Token": { hi: "ऑफ़लाइन टोकन प्राप्त करें", te: "ఆఫ్‌లైన్ టోకెన్ పొందండి" },
  "Active Upcoming Slot": { hi: "सक्रिय आगामी स्लॉट", te: "ప్రస్తుత బుకింగ్ స్లాట్" },
  "Reschedule Slot": { hi: "स्लॉट पुनर्निर्धारित करें", te: "స్లాట్‌ను రీషెడ్యూల్ చేయండి" },
  "Cancel Booking": { hi: "बुकिंग रद्द करें", te: "బుకింగ్ రద్దు చేయండి" },
  "View Digital Receipt": { hi: "डिजिटल रसीद देखें", te: "డిజిటల్ రశీదు చూడండి" },
  "Booking History & Receipts": { hi: "बुकिंग इतिहास और रसीदें", te: "బుకింగ్ చరిత్ర & రశీదులు" },
  "Booking ID": { hi: "बुकिंग आईडी", te: "బుకింగ్ ఐడి" },
  "Date": { hi: "तारीख", te: "తేదీ" },
  "Time Slot": { hi: "समय स्लॉट", te: "సమయం స్లాట్" },
  "Status": { hi: "स्थिति", te: "స్థితి" },
  "Actions": { hi: "कार्रवाई", te: "చర్యలు" },

  // Commodities & Badges
  "Rice": { hi: "चावल", te: "బియ్యం" },
  "Wheat": { hi: "गेहूं", te: "గోధుమలు" },
  "Sugar": { hi: "चीनी", te: "చక్కెర" },
  "Kerosene": { hi: "मिट्टी का तेल", te: "కిరోసిన్" },
  "Edible Oil": { hi: "खाद्य तेल", te: "వంట నూనె" },
  "In Stock": { hi: "स्टॉक में उपलब्ध", te: "స్టాక్‌లో ఉంది" },
  "Adequate": { hi: "पर्याप्त", te: "సరిపడా ఉంది" },
  "Low Stock": { hi: "कम स्टॉक", te: "తక్కువ స్టాక్" },
  "CONFIRMED": { hi: "पुष्ट (Confirmed)", te: "ధృవీకరించబడింది" },
  "CHECKED IN": { hi: "चेक इन पूर्ण", te: "చెక్-ఇన్ పూర్తయింది" },
  "CHECKED_IN": { hi: "चेक इन पूर्ण", te: "చెక్-ఇన్ పూర్తయింది" },
  "CANCELLED": { hi: "रद्द (Cancelled)", te: "రద్దు చేయబడింది" },
  "EXPIRED": { hi: "समाप्त (Expired)", te: "గడువు ముగిసింది" },
  "MISSED": { hi: "छूट गया (Missed)", te: "మిస్ అయింది" },

  // Dealer Dashboard
  "Today's Bookings": { hi: "आज की कुल बुकिंग", te: "ఈ రోజు బుకింగ్‌లు" },
  "Completed Distributions": { hi: "वितरण संपन्न", te: "పంపిణీ పూర్తయినవి" },
  "Pending Check-ins": { hi: "लंबित चेक-इन", te: "వేచి ఉన్న చెక్-ఇన్‌లు" },
  "Missed Slots": { hi: "छूटे हुए स्लॉट", te: "మిస్ అయిన స్లాట్లు" },
  "QR Verification & Check-in": { hi: "क्यूआर सत्यापन और चेक-इन", te: "క్యూఆర్ ధృవీకరణ & చెక్-ఇన్" },
  "Enter Booking ID Manually": { hi: "बुकिंग आईडी मैन्युअल रूप से दर्ज करें", te: "బుకింగ్ ఐడిని నమోదు చేయండి" },
  "Verify & Check-in": { hi: "सत्यापित करें और चेक-इन करें", te: "ధృవీకరించి చెక్-ఇన్ చేయండి" },
  "Start Camera Scanner": { hi: "कैमरा स्कैनर शुरू करें", te: "కెమెరా స్కానర్ ప్రారంభించండి" },
  "Assisted Slot Booking (for Elderly / Disabled)": { hi: "सहायता प्राप्त स्लॉट बुकिंग (बुजुर्गों / दिव्यांगों के लिए)", te: "సహాయక స్లాట్ బుకింగ్ (వృద్ధులు / వికలాంగుల కోసం)" },
  "Record Ration Distribution": { hi: "राशन वितरण दर्ज करें", te: "రేషన్ పంపిణీని నమోదు చేయండి" },
  "Beneficiary Details": { hi: "लाभार्थी का विवरण", te: "లబ్ధిదారుని వివరాలు" },
  "Quantities Distributed": { hi: "वितरित मात्रा", te: "పంపిణీ చేసిన పరిమాణం" },
  "Confirm & Distribute Ration": { hi: "पुष्टि करें और राशन वितरित करें", te: "ధృవీకరించి రేషన్ పంపిణీ చేయండి" },
  "Today's Queue & Booking Registry": { hi: "आज की कतार और बुकिंग रजिस्ट्री", te: "ఈ రోజు క్యూ & బుకింగ్ రిజిస్టర్" },
  "Shop Stock Intake": { hi: "दुकान स्टॉक प्राप्ति", te: "షాప్ స్టాక్ ఇన్ టేక్" },
  "Government Supply Reference Code": { hi: "सरकारी आपूर्ति संदर्भ कोड", te: "ప్రభుత్వ సరఫరా రిఫరెన్స్ కోడ్" },
  "Record Stock Intake": { hi: "स्टॉक प्राप्ति दर्ज करें", te: "స్టాక్ ఇన్ టేక్ నమోదు చేయండి" },
  "Daily Distribution Analytics": { hi: "दैनिक वितरण विश्लेषण", te: "రోజువారీ పంపిణీ విశ్లేషణ" },
  "Live Crowd Monitoring — Shop Floor": { hi: "लाइव भीड़ निगरानी — दुकान तल", te: "లైవ్ రద్దీ పర్యవేక్షణ — షాప్ ఫ్లోర్" },
  "Persons": { hi: "व्यक्ति", te: "వ్యక్తులు" },
  "Start Monitoring": { hi: "निगरानी शुरू करें", te: "పర్యవేక్షణ ప్రారంభించు" },
  "Stop": { hi: "रोकें", te: "ఆపు" },
  "Recent Count Log": { hi: "हालिया गणना लॉग", te: "ఇటీవలి గణన లాగ్" },
  "Crowd Level": { hi: "भीड़ का स्तर", te: "రద్దీ స్థాయి" },
  "Low": { hi: "कम", te: "తక్కువ" },
  "Moderate": { hi: "मध्यम", te: "మధ్యస్థం" },
  "High": { hi: "अधिक", te: "ఎక్కువ" },

  // Admin Dashboard
  "Civil Supplies Monitoring Panel": { hi: "नागरिक आपूर्ति निगरानी पैनल", te: "పౌర సరఫరాల పర్యవేక్షణ ప్యానెల్" },
  "All States": { hi: "सभी राज्य", te: "అన్ని రాష్ట్రాలు" },
  "All Districts": { hi: "सभी जिले", te: "అన్ని జిల్లాలు" },
  "All Regions": { hi: "सभी क्षेत्र", te: "అన్ని ప్రాంతాలు" },
  "Total Beneficiaries": { hi: "कुल लाभार्थी", te: "మొత్తం లబ్ధిదారులు" },
  "Active Fair Price Shops": { hi: "सक्रिय उचित दर दुकानें", te: "సక్రియ ఫెయిర్ ప్రైస్ షాపులు" },
  "Month Grains Dispatched": { hi: "इस माह अनाज वितरित", te: "ఈ నెల పంపిణీ అయిన ధాన్యాలు" },
  "PDS Distribution Efficiency": { hi: "वितरण दक्षता", te: "పంపిణీ సామర్థ్యం" },
  "State Allocation & Supply Overview": { hi: "राज्य आवंटन एवं आपूर्ति अवलोकन", te: "రాష్ట్ర కేటాయింపులు & సరఫరా పరిశీలన" },
  "Fair Price Shops Registry": { hi: "उचित दर दुकान रजिस्ट्री", te: "ఫెయిర్ ప్రైస్ షాపుల రిజిస్ట్రీ" },
  "Add New FPS Shop": { hi: "नई दुकान जोड़ें", te: "కొత్త షాపును జోడించండి" },
  "AI Fraud Detection & Audit Alerts": { hi: "एआई धोखाधड़ी पहचान एवं ऑडिट अलर्ट", te: "AI మోసాల గుర్తింపు & ఆడిట్ హెచ్చరికలు" },

  // AI Chatbot
  "PDS Sahayak (AI Assistant)": { hi: "पीडीएस सहायक (एआई सहायक)", te: "పిడిఎస్ సహాయక్ (AI అసిస్టెంట్)" },
  "Ask in English, Hindi, or Telugu...": { hi: "हिंदी, अंग्रेजी या तेलुगु में पूछें...", te: "తెలుగు, ఇంగ్లీష్ లేదా హిందీలో అడగండి..." },

  // Modals
  "Schedule Your Ration Collection Slot": { hi: "अपने राशन संग्रह स्लॉट को शेड्यूल करें", te: "మీ రేషన్ సేకరణ స్లాట్‌ను షెడ్యూల్ చేయండి" },
  "1. Select Booking Date": { hi: "1. बुकिंग की तारीख चुनें", te: "1. బుకింగ్ తేదీని ఎంచుకోండి" },
  "2. Select Time Slot & Estimate Crowd": { hi: "2. समय स्लॉट चुनें और भीड़ का अनुमान लगाएं", te: "2. స్లాట్ సమయం ఎంచుకుని రద్దీని అంచనా వేయండి" },
  "Crowd Level Estimation": { hi: "भीड़ स्तर का अनुमान", te: "రద్దీ స్థాయి అంచనా" },
  "3. Select Commodities to Collect": { hi: "3. लेने के लिए अनाज/सामग्री चुनें", te: "3. సేకరించాల్సిన వస్తువులను ఎంచుకోండి" },
  "Confirm Booking": { hi: "बुकिंग की पुष्टि करें", te: "బుకింగ్‌ను నిర్ధారించండి" },
  "RATION BOOKING RECEIPT": { hi: "राशन बुकिंग रसीद", te: "రేషన్ బుకింగ్ రశీదు" },
  "Dealer must scan this QR code for check-in": { hi: "चेक-इन के लिए डीलर को यह क्यूआर कोड स्कैन करना होगा", te: "డీలర్ చెక్-ఇన్ కోసం ఈ క్యూఆర్ కోడ్‌ను స్కాన్ చేయాలి" }
};

// Global Translation Function
function updateTranslations(lang) {
  if (!lang || !translations[lang]) lang = 'en';
  
  if (typeof state !== 'undefined') {
    state.lang = lang;
  }
  localStorage.setItem('pds_lang', lang);
  document.documentElement.lang = lang;

  // 1. Update all elements with explicit data-i18n attributes
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang] && translations[lang][key]) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = translations[lang][key];
      } else {
        el.innerHTML = translations[lang][key];
      }
    }
  });

  // 2. Update placeholders with data-i18n-placeholder
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (translations[lang] && translations[lang][key]) {
      el.placeholder = translations[lang][key];
    }
  });

  // 3. Update titles/tooltips with data-i18n-title
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title');
    if (translations[lang] && translations[lang][key]) {
      el.title = translations[lang][key];
    }
  });

  // 4. Recursive Walk of Text Nodes for Universal Word-for-Word Translation
  // This guarantees that any visible text or word on the entire webpage is translated
  if (lang !== 'en') {
    translateDOMTextNodes(document.body, lang);
  } else {
    // If reverting to English, run reverse mapping
    restoreDOMTextNodesToEnglish(document.body);
  }

  // 5. Update Auth Portal Configs if on app page
  if (typeof portalConfigs !== 'undefined') {
    if (lang === 'hi') {
      portalConfigs.beneficiary.badgeText = "नागरिक पीडीएस पोर्टल";
      portalConfigs.beneficiary.title = "नागरिक लॉगिन";
      portalConfigs.beneficiary.subtitle = "अपनी राशन बुकिंग सेवाओं तक पहुंचने के लिए अपना राशन कार्ड नंबर और पासवर्ड दर्ज करें।";
      portalConfigs.beneficiary.userLabel = '<i class="fas fa-id-card"></i> राशन कार्ड नंबर';
      portalConfigs.beneficiary.userPlaceholder = "उदा. RATION999 या 12 अंकों का नंबर";
      portalConfigs.beneficiary.submitText = "नागरिक पोर्टल में साइन इन करें";

      portalConfigs.dealer.badgeText = "उचित दर दुकान पोर्टल";
      portalConfigs.dealer.title = "उचित दर दुकान डीलर लॉगिन";
      portalConfigs.dealer.subtitle = "कतार चेक-इन और राशन वितरण के लिए अधिकृत उचित दर दुकान डीलरों का पोर्टल।";
      portalConfigs.dealer.userLabel = '<i class="fas fa-store-alt"></i> डीलर आईडी / दुकान कोड';
      portalConfigs.dealer.userPlaceholder = "उदा. DEALER101";
      portalConfigs.dealer.submitText = "डीलर पोर्टल में साइन इन करें";
      portalConfigs.dealer.noticeTitle = "केवल अधिकृत उचित दर डीलर";
      portalConfigs.dealer.noticeText = "डीलर खाते जिला नागरिक आपूर्ति कार्यालय द्वारा प्रदान और ऑडिट किए जाते हैं। सार्वजनिक पंजीकरण की अनुमति नहीं है।";

      portalConfigs.admin.badgeText = "नागरिक आपूर्ति विभाग पोर्टल";
      portalConfigs.admin.title = "सरकारी प्रशासन लॉगिन";
      portalConfigs.admin.subtitle = "आवंटन, आपूर्ति श्रृंखला और निगरानी के लिए राज्य और जिला नागरिक आपूर्ति अधिकारियों का पोर्टल।";
      portalConfigs.admin.userLabel = '<i class="fas fa-user-shield"></i> सरकारी एडमिन आईडी / अधिकारी कोड';
      portalConfigs.admin.userPlaceholder = "उदा. ADMIN001";
      portalConfigs.admin.submitText = "सरकारी पोर्टल में साइन इन करें";
      portalConfigs.admin.noticeTitle = "प्रतिबंधित सरकारी प्रणाली";
      portalConfigs.admin.noticeText = "खाद्य एवं नागरिक आपूर्ति विभाग के अधिकृत अधिकारियों तक ही पहुंच सीमित है। सभी लॉगिन गतिविधियों की निगरानी की जाती है।";
    } else if (lang === 'te') {
      portalConfigs.beneficiary.badgeText = "సిటిజన్ పిడిఎస్ పోర్టల్";
      portalConfigs.beneficiary.title = "సిటిజన్ లాగిన్";
      portalConfigs.beneficiary.subtitle = "మీ రేషన్ బుకింగ్ సేవలను పొందడానికి మీ రేషన్ కార్డు నంబర్ మరియు పాస్‌వర్డ్ నమోదు చేయండి.";
      portalConfigs.beneficiary.userLabel = '<i class="fas fa-id-card"></i> రేషన్ కార్డు నంబరు';
      portalConfigs.beneficiary.userPlaceholder = "ఉదా. RATION999 లేదా 12 అంకెల సంఖ్య";
      portalConfigs.beneficiary.submitText = "సిటిజన్ పోర్టల్‌లోకి లాగిన్ అవ్వండి";

      portalConfigs.dealer.badgeText = "ఫెయిర్ ప్రైస్ షాప్ పోర్టల్";
      portalConfigs.dealer.title = "FPS డీలర్ లాగిన్";
      portalConfigs.dealer.subtitle = "క్యూ చెక్-ఇన్ మరియు రేషన్ పంపిణీ కోసం అధీకృత చౌక ధరల దుకాణం డీలర్ల పోర్టల్.";
      portalConfigs.dealer.userLabel = '<i class="fas fa-store-alt"></i> డీలర్ ఐడి / షాప్ కోడ్';
      portalConfigs.dealer.userPlaceholder = "ఉదా. DEALER101";
      portalConfigs.dealer.submitText = "డీలర్ పోర్టల్‌లోకి లాగిన్ అవ్వండి";
      portalConfigs.dealer.noticeTitle = "అధీకృత FPS డీలర్లు మాత్రమే";
      portalConfigs.dealer.noticeText = "డీలర్ ఖాతాలు జిల్లా పౌర సరఫరాల కార్యాలయం ద్వారా అందించబడతాయి మరియు తనిఖీ చేయబడతాయి. పబ్లిక్ రిజిస్ట్రేషన్ అనుమతించబడదు.";

      portalConfigs.admin.badgeText = "పౌర సరఫరాల శాఖ పోర్టల్";
      portalConfigs.admin.title = "ప్రభుత్వ పరిపాలన లాగిన్";
      portalConfigs.admin.subtitle = "కేటాయింపులు, సరఫరా గొలుసు మరియు పర్యవేక్షణ కోసం రాష్ట్ర & జిల్లా పౌర సరఫరాల అధికారుల పోర్టల్.";
      portalConfigs.admin.userLabel = '<i class="fas fa-user-shield"></i> ప్రభుత్వ అడ్మిన్ ఐడి / ఆఫీసర్ కోడ్';
      portalConfigs.admin.userPlaceholder = "ఉదా. ADMIN001";
      portalConfigs.admin.submitText = "ప్రభుత్వ పోర్టల్‌లోకి లాగిన్ అవ్వండి";
      portalConfigs.admin.noticeTitle = "పరిమిత ప్రభుత్వ వ్యవస్థ";
      portalConfigs.admin.noticeText = "ఆహార & పౌర సరఫరాల శాఖ అధికారులకు మాత్రమే ప్రవేశం పరిమితం చేయబడింది. అన్ని లాగిన్ కార్యకలాపాలు పర్యవేక్షించబడతాయి.";
    } else {
      portalConfigs.beneficiary.badgeText = "Citizen PDS Portal";
      portalConfigs.beneficiary.title = "Citizen Login";
      portalConfigs.beneficiary.subtitle = "Enter your Ration Card Number and Password to access your ration booking services.";
      portalConfigs.beneficiary.userLabel = '<i class="fas fa-id-card"></i> Ration Card Number';
      portalConfigs.beneficiary.userPlaceholder = "e.g. RATION999 or 12-digit number";
      portalConfigs.beneficiary.submitText = "Sign In to Citizen Portal";

      portalConfigs.dealer.badgeText = "Fair Price Shop Portal";
      portalConfigs.dealer.title = "FPS Dealer Login";
      portalConfigs.dealer.subtitle = "Authorized Fair Price Shop Dealers access for queue check-in & ration distribution.";
      portalConfigs.dealer.userLabel = '<i class="fas fa-store-alt"></i> Dealer ID / Shop Code';
      portalConfigs.dealer.userPlaceholder = "e.g. DEALER101";
      portalConfigs.dealer.submitText = "Sign In to Dealer Portal";
      portalConfigs.dealer.noticeTitle = "Authorized FPS Dealers Only";
      portalConfigs.dealer.noticeText = "Dealer accounts are provisioned and audited by the District Civil Supplies Office. Public registration is not permitted.";

      portalConfigs.admin.badgeText = "Civil Supplies Department Portal";
      portalConfigs.admin.title = "Government Administration Login";
      portalConfigs.admin.subtitle = "State & District Civil Supplies Officers portal for allocation, supply chains & oversight.";
      portalConfigs.admin.userLabel = '<i class="fas fa-user-shield"></i> Government Admin ID / Officer Code';
      portalConfigs.admin.userPlaceholder = "e.g. ADMIN001";
      portalConfigs.admin.submitText = "Sign In to Government Portal";
      portalConfigs.admin.noticeTitle = "Restricted Government System";
      portalConfigs.admin.noticeText = "Access is restricted to authorized Food & Civil Supplies Department officers. All login activities are monitored.";
    }

    if (typeof switchAuthPortal === 'function' && typeof state !== 'undefined') {
      const authSec = document.getElementById('auth-section');
      if (authSec && authSec.style.display !== 'none') {
        const urlRole = new URLSearchParams(window.location.search).get('role');
        const roleToUse = (urlRole && ['beneficiary', 'dealer', 'admin'].includes(urlRole)) ? urlRole : (state.activeRole || 'beneficiary');
        switchAuthPortal(roleToUse);
      }
    }
  }

  // 6. Update language selector dropdown values across all pages
  document.querySelectorAll('#language-select, #landing-language-select').forEach(sel => {
    if (sel.value !== lang) sel.value = lang;
  });

  // 7. Update Chatbot greeting & quick replies if available
  if (typeof initChatbotGreeting === 'function') {
    initChatbotGreeting();
  } else if (typeof renderChatbotQuickReplies === 'function') {
    renderChatbotQuickReplies();
  }
}

// Recursive DOM text walker for word-for-word translation
function translateDOMTextNodes(rootNode, lang) {
  if (typeof rootNode === 'string') {
    lang = rootNode;
    rootNode = document.body;
  }
  if (!rootNode) rootNode = document.body;
  if (!lang) lang = localStorage.getItem('pds_lang') || 'en';

  const ignoredTags = ['SCRIPT', 'STYLE', 'CODE', 'PRE'];
  if (ignoredTags.includes(rootNode.nodeName)) return;

  if (rootNode.nodeType === Node.TEXT_NODE) {
    const rawText = rootNode.nodeValue;
    const trimmed = rawText.trim();
    if (trimmed && phraseDictionary[trimmed] && phraseDictionary[trimmed][lang]) {
      rootNode.nodeValue = rawText.replace(trimmed, phraseDictionary[trimmed][lang]);
    }
  } else {
    // Check placeholders on form fields
    if (rootNode.tagName === 'INPUT' || rootNode.tagName === 'TEXTAREA') {
      const ph = rootNode.getAttribute('placeholder');
      if (ph && phraseDictionary[ph.trim()] && phraseDictionary[ph.trim()][lang]) {
        rootNode.setAttribute('placeholder', phraseDictionary[ph.trim()][lang]);
      }
    }
    // Traverse children
    if (rootNode.childNodes) {
      for (let child of rootNode.childNodes) {
        translateDOMTextNodes(child, lang);
      }
    }
  }
}

// Reverse mapping when switching back to English
function restoreDOMTextNodesToEnglish(rootNode) {
  if (!rootNode || typeof rootNode === 'string') rootNode = document.body;
  const ignoredTags = ['SCRIPT', 'STYLE', 'CODE', 'PRE'];
  if (ignoredTags.includes(rootNode.nodeName)) return;

  if (rootNode.nodeType === Node.TEXT_NODE) {
    const rawText = rootNode.nodeValue;
    const trimmed = rawText.trim();
    if (trimmed) {
      for (const [enPhrase, trans] of Object.entries(phraseDictionary)) {
        if (trans.hi === trimmed || trans.te === trimmed) {
          rootNode.nodeValue = rawText.replace(trimmed, enPhrase);
          break;
        }
      }
    }
  } else {
    if (rootNode.tagName === 'INPUT' || rootNode.tagName === 'TEXTAREA') {
      const ph = rootNode.getAttribute('placeholder');
      if (ph) {
        for (const [enPhrase, trans] of Object.entries(phraseDictionary)) {
          if (trans.hi === ph.trim() || trans.te === ph.trim()) {
            rootNode.setAttribute('placeholder', enPhrase);
            break;
          }
        }
      }
    }
    for (let child of rootNode.childNodes) {
      restoreDOMTextNodesToEnglish(child);
    }
  }
}

// 3. Fully Functional Universal Navigation "Back to Previous Page" Handler
function handleGlobalBack() {
  // A. Check if any active modal is open -> Close active modal first
  const activeModal = document.querySelector('.modal-overlay.active, .modal-overlay[style*="display: flex"], .modal-overlay[style*="display: block"]');
  if (activeModal && activeModal.style.display !== 'none' && !activeModal.classList.contains('hidden')) {
    activeModal.classList.remove('active');
    activeModal.style.display = 'none';
    return;
  }

  // B. Check if Citizen Registration form is visible -> Go back to Login Form
  const regContainer = document.getElementById('register-form-container');
  const loginContainer = document.getElementById('login-form-container');
  if (regContainer && regContainer.style.display === 'block') {
    regContainer.style.display = 'none';
    if (loginContainer) loginContainer.style.display = 'block';
    const activeRole = (typeof state !== 'undefined' && state.activeRole) ? state.activeRole : 'beneficiary';
    if (typeof portalConfigs !== 'undefined' && portalConfigs[activeRole]) {
      const cfg = portalConfigs[activeRole];
      const titleEl = document.getElementById('auth-title');
      const subEl = document.getElementById('auth-subtitle');
      if (titleEl) titleEl.innerText = cfg.title;
      if (subEl) subEl.innerText = cfg.subtitle;
    }
    return;
  }

  // C. Check if in Auth / Login Section on index.html -> Return to Landing Portal Hub
  const authSection = document.getElementById('auth-section');
  if (authSection && authSection.style.display !== 'none') {
    window.location.href = 'landing.html';
    return;
  }

  // D. Check if currently viewing any Authenticated Dashboard on index.html
  const benDash = document.getElementById('beneficiary-dashboard');
  const dealerDash = document.getElementById('dealer-dashboard');
  const adminDash = document.getElementById('admin-dashboard');

  const isDashboardActive = (benDash && benDash.style.display === 'grid') ||
                            (dealerDash && dealerDash.style.display === 'grid') ||
                            (adminDash && adminDash.style.display === 'grid');

  if (isDashboardActive) {
    const currentLang = localStorage.getItem('pds_lang') || 'en';
    const confirmPrompt = (currentLang === 'hi') ? "क्या आप पोर्टल हब पर वापस जाना चाहते हैं?" :
                          (currentLang === 'te') ? "మీరు పోర్టల్ హబ్‌కు తిరిగి వెళ్లాలనుకుంటున్నారా?" :
                          "Do you want to return to the Portal Hub?";
    if (confirm(confirmPrompt)) {
      window.location.href = 'landing.html';
    }
    return;
  }

  // E. On landing.html or general fallback
  if (window.history.length > 1 && document.referrer && document.referrer.includes(window.location.host)) {
    window.history.back();
  } else {
    window.location.href = 'landing.html';
  }
}

// Expose functions globally on window
window.updateTranslations = updateTranslations;
window.handleGlobalBack = handleGlobalBack;
window.translateDOMTextNodes = translateDOMTextNodes;
window.restoreDOMTextNodesToEnglish = restoreDOMTextNodesToEnglish;

// 4. Initialize Multi-lingual Engine & Listeners on Page Ready
document.addEventListener('DOMContentLoaded', () => {
  const savedLang = localStorage.getItem('pds_lang') || 'en';
  
  // Attach listeners to any language selector dropdown
  document.querySelectorAll('#language-select, #landing-language-select').forEach(sel => {
    sel.value = savedLang;
    sel.addEventListener('change', (e) => {
      updateTranslations(e.target.value);
    });
  });

  // Attach listeners to all Back Navigation buttons
  document.querySelectorAll('#global-back-btn, #landing-back-btn, .dashboard-nav-back-btn, .modal-back-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      handleGlobalBack();
    });
  });

  // Apply saved language immediately
  if (savedLang !== 'en') {
    updateTranslations(savedLang);
  }
});
