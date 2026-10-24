/**
 * Smart Ration Slot Booking System - PDS Sahayak (AI Real-time Assistant)
 * Features:
 *  - Real-time zero delay instant execution
 *  - Speech-to-text voice recognition (Microphone)
 *  - Text-to-speech audio reader (Speaker)
 *  - Animated typing indicator
 *  - High accuracy PDS intent & doubt resolution
 *  - Live personalized user quota & slot lookup
 *  - Interactive in-chat action buttons
 *  - Multilingual support (English, Hindi, Telugu)
 */

(function() {
  const API_ENDPOINT = (typeof API_BASE !== 'undefined') ? API_BASE : window.location.origin;

  function getCurrentLang() {
    return localStorage.getItem('pds_lang') || (window.currentLanguage) || 'en';
  }

  function getActiveToken() {
    return localStorage.getItem('pds_token') || (window.state && window.state.token) || '';
  }

  function getActiveUser() {
    try {
      return JSON.parse(localStorage.getItem('pds_user')) || (window.state && window.state.user) || null;
    } catch (e) {
      return null;
    }
  }

  // Multilingual Initial Greeting
  window.initChatbotGreeting = function() {
    const container = document.getElementById('chat-messages-container');
    if (!container) return;
    container.innerHTML = '';

    const lang = getCurrentLang();
    const user = getActiveUser();
    const userName = user && user.name ? ` ${user.name}` : '';

    const greetings = {
      en: `👋 **Hello${userName}! I am PDS Sahayak**, your real-time 24x7 AI Assistant.\n\nI can instantly clarify any doubt about:\n• 📅 **How to book or reschedule a slot**\n• 📦 **Your live remaining monthly ration quota**\n• 🧾 **Showing QR codes & offline verification**\n• 💰 **Official prices (Free foodgrains under PMGKAY)**\n• ⏰ **Fair Price Shop operational timings**\n\nHow can I help you today? Ask me any question or pick an option below:`,
      hi: `👋 **नमस्ते${userName}! मैं पीडीएस सहायक हूँ**, आपका 24x7 रीयल-टाइम एआई सहायक।\n\nमैं तुरंत इन विषयों पर आपके हर संदेह का समाधान कर सकता हूँ:\n• 📅 **राशन स्लॉट कैसे बुक या रीशेड्यूल करें**\n• 📦 **आपका लाइव शेष मासिक राशन कोटा**\n• 🧾 **क्यूआर कोड और बिना इंटरनेट सत्यापन**\n• 💰 **आधिकारिक दरें (चावल-गेहूं 100% मुफ़्त)**\n• ⏰ **दुकान के खुलने का समय एवं नियम**\n\nआप किसी भी भाषा में अपना प्रश्न पूछ सकते हैं या नीचे दिए गए विकल्पों को चुन सकते हैं:`,
      te: `👋 **నమస్కారం${userName}! నేను పీడీఎస్ సహాయక్**, మీ 24x7 రియల్-టైమ్ ఏఐ అసిస్టెంట్.\n\nనేను మీ సందేహాలను తక్షణమే పరిష్కరించగలను:\n• 📅 **స్లాట్ బుకింగ్ మరియు రీషెడ్యూల్ విధానం**\n• 📦 **మీ లైవ్ నెలవారీ రేషన్ కోటా వివరాలు**\n• 🧾 **క్యూఆర్ పాస్ మరియు ఆఫ్ లైన్ ధృవీకరణ**\n• 💰 **ధరలు (PMGKAY కింద 100% ఉచిత ఆహార ధాన్యాలు)**\n• ⏰ **రేషన్ దుకాణం పనివేళలు మరియు సెలవులు**\n\nనేను మీకు ఎలా సహాయపడగలను? కింద ఉన్న ఆప్షన్‌ను ఎంచుకోవచ్చు లేదా టైప్ చేయవచ్చు:`
    };

    const initialActions = [
      { action: 'book_slot', label: lang === 'te' ? '📅 స్లాట్ బుక్ చేయండి' : lang === 'hi' ? '📅 राशन स्लॉट बुक करें' : '📅 Book a Slot Now' },
      { action: 'check_quota', label: lang === 'te' ? '📦 నా కోటా తనిఖీ చేయండి' : lang === 'hi' ? '📦 मेरा कोटा चेक करें' : '📦 Check My Live Quota' }
    ];

    appendChatBubble(greetings[lang] || greetings['en'], 'bot', { actions: initialActions });
    window.renderChatbotQuickReplies();
  };

  // Convert Markdown symbols into rich HTML
  function formatMarkdownToHTML(text) {
    if (!text) return '';
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/^• (.*)$/gm, '<li style="margin-left: 1.1rem; list-style-type: disc;">$1</li>')
      .replace(/^\d+\. (.*)$/gm, '<li style="margin-left: 1.1rem; list-style-type: decimal;">$1</li>')
      .replace(/\n/g, '<br>');
  }

  // Append bubble into messages scroll area
  function appendChatBubble(text, sender, options = {}) {
    const container = document.getElementById('chat-messages-container');
    if (!container) return;

    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${sender}`;

    if (sender === 'bot') {
      const header = document.createElement('div');
      header.className = 'chat-bubble-header';
      header.innerHTML = `
        <span><i class="fas fa-robot"></i> PDS Sahayak</span>
        <button class="chat-speech-btn" title="Read answer aloud">
          <i class="fas fa-volume-up"></i>
        </button>
      `;

      const speechBtn = header.querySelector('.chat-speech-btn');
      speechBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        playTextToSpeech(text);
      });

      bubble.appendChild(header);

      const bodyEl = document.createElement('div');
      bodyEl.innerHTML = formatMarkdownToHTML(text);
      bubble.appendChild(bodyEl);

      if (options.actions && options.actions.length > 0) {
        const actionsWrapper = document.createElement('div');
        actionsWrapper.className = 'chat-bubble-actions';
        options.actions.forEach(act => {
          const actBtn = document.createElement('button');
          actBtn.type = 'button';
          actBtn.className = 'chat-action-btn';
          actBtn.innerHTML = act.label;
          actBtn.addEventListener('click', () => {
            handleChatAction(act.action);
          });
          actionsWrapper.appendChild(actBtn);
        });
        bubble.appendChild(actionsWrapper);
      }
    } else {
      bubble.innerText = text;
    }

    container.appendChild(bubble);
    container.scrollTop = container.scrollHeight;
  }

  // Text-To-Speech audio output
  function playTextToSpeech(rawText) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const cleanSpeech = rawText
      .replace(/[*_`#•]/g, ' ')
      .replace(/[🟢🌾🍬🏪💡📌⚠️✅🇮🇳📱📞📝👋]/g, '')
      .trim();

    const lang = getCurrentLang();
    const utterance = new SpeechSynthesisUtterance(cleanSpeech);
    utterance.lang = lang === 'te' ? 'te-IN' : lang === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    window.speechSynthesis.speak(utterance);
  }

  // Interactive In-Chat Actions
  function handleChatAction(actionType) {
    const isMainApp = window.location.pathname.includes('index.html');
    const token = getActiveToken();
    const user = getActiveUser();

    switch (actionType) {
      case 'book_slot':
        if (!isMainApp || !token || (user && user.role !== 'beneficiary')) {
          window.location.href = 'index.html?role=beneficiary';
        } else {
          const bookBtn = document.getElementById('open-booking-modal-btn');
          if (bookBtn) {
            bookBtn.click();
          } else {
            document.getElementById('booking-modal')?.classList.add('active');
          }
        }
        break;

      case 'reschedule_slot':
        if (!isMainApp || !token || (user && user.role !== 'beneficiary')) {
          window.location.href = 'index.html?role=beneficiary';
        } else {
          const reschedBtn = document.querySelector('.btn-reschedule');
          if (reschedBtn) {
            reschedBtn.click();
          } else {
            document.getElementById('beneficiary-bookings-list')?.scrollIntoView({ behavior: 'smooth' });
            document.getElementById('open-booking-modal-btn')?.click();
          }
        }
        break;

      case 'view_receipt':
        if (!isMainApp || !token) {
          window.location.href = 'index.html?role=beneficiary';
        } else {
          const receiptModal = document.getElementById('receipt-modal');
          if (receiptModal) receiptModal.classList.add('active');
        }
        break;

      case 'check_quota':
        if (!isMainApp || !token) {
          window.location.href = 'index.html?role=beneficiary';
        } else {
          const quotaCard = document.querySelector('.kpi-card');
          quotaCard?.scrollIntoView({ behavior: 'smooth' });
        }
        break;

      case 'call_helpline':
        window.open('tel:1967', '_self');
        break;

      default:
        console.log('Action triggered:', actionType);
    }
  }

  // Animated Typing Indicator
  function showTypingIndicator() {
    const container = document.getElementById('chat-messages-container');
    if (!container) return null;

    const indicator = document.createElement('div');
    indicator.className = 'typing-indicator';
    indicator.id = 'chat-typing-loader';
    indicator.innerHTML = `
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
      <span style="font-size: 0.72rem; color: #93c5fd; margin-left: 4px;">PDS Sahayak is replying...</span>
    `;
    container.appendChild(indicator);
    container.scrollTop = container.scrollHeight;
    return indicator;
  }

  function removeTypingIndicator() {
    const indicator = document.getElementById('chat-typing-loader');
    if (indicator) indicator.remove();
  }

  // Real-Time Query Sender (Zero Latency Execution)
  async function sendRealTimeChatMessage(text) {
    if (!text || !text.trim()) return;
    const cleanText = text.trim();

    // 1. Immediately append user bubble
    appendChatBubble(cleanText, 'user');

    // 2. Show typing indicator
    showTypingIndicator();

    const token = getActiveToken();
    const lang = getCurrentLang();
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const startTime = Date.now();
    try {
      const res = await fetch(`${API_ENDPOINT}/api/chatbot/message`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ message: cleanText, language: lang })
      });
      const data = await res.json();

      const elapsed = Date.now() - startTime;
      const remainingDelay = Math.max(0, 180 - elapsed);

      setTimeout(() => {
        removeTypingIndicator();
        appendChatBubble(data.answer, 'bot', { actions: data.actions });

        if (data.suggestions && data.suggestions.length > 0) {
          updateDynamicQuickReplies(data.suggestions);
        }
      }, remainingDelay);

    } catch (err) {
      setTimeout(() => {
        removeTypingIndicator();
        appendChatBubble("I am available 24x7 to assist you. Please choose from the quick services below:", 'bot', {
          actions: [
            { action: 'book_slot', label: '📅 How to Book a Slot' },
            { action: 'reschedule_slot', label: '🔄 Reschedule Slot' },
            { action: 'call_helpline', label: '📞 Toll-Free Helpline 1967' }
          ]
        });
      }, 150);
    }
  }

  // Quick reply options dictionary
  const quickReplies = {
    en: [
      "📅 How to book a ration slot?",
      "🔄 Can I reschedule a missed slot?",
      "📦 What is my monthly quota?",
      "💰 Is ration free under PMGKAY?",
      "⏰ What are shop timings?",
      "📋 What documents to bring?",
      "👴 Senior citizen priority",
      "📞 Grievance & Toll-Free 1967"
    ],
    hi: [
      "📅 राशन स्लॉट कैसे बुक करें?",
      "🔄 छूटे हुए स्लॉट को कैसे रीशेड्यूल करें?",
      "📦 मेरा मासिक राशन कोटा क्या है?",
      "💰 क्या राशन मुफ़्त है?",
      "⏰ दुकान खुलने का समय क्या है?",
      "📋 क्या दस्तावेज साथ ले जाने हैं?",
      "👴 बुजुर्गों के लिए विशेष सुविधा",
      "📞 शिकायत एवं टोल-फ्री 1967"
    ],
    te: [
      "📅 రేషన్ స్లాట్ ఎలా బుక్ చేయాలి?",
      "🔄 మిస్ అయిన స్లాట్‌ను ఎలా రీషెడ్యూల్ చేయాలి?",
      "📦 నా నెలవారీ కోటా ఎంత?",
      "💰 రేషన్ ఉచితంగా ఇస్తారా?",
      "⏰ రేషన్ దుకాణం పనివేళలు ఏమిటి?",
      "📋 ఏ పత్రాలు వెంట తీసుకెళ్లాలి?",
      "👴 వృద్ధులకు ప్రత్యేక సౌకర్యం ఉందా?",
      "📞 ఫిర్యాదులు & టోల్‌ఫ్రీ 1967"
    ]
  };

  window.renderChatbotQuickReplies = function() {
    const container = document.getElementById('chat-quick-replies-box');
    if (!container) return;
    container.innerHTML = '';
    
    const lang = getCurrentLang();
    const replies = quickReplies[lang] || quickReplies['en'];
    replies.forEach(reply => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'quick-reply-btn';
      btn.innerText = reply;
      btn.addEventListener('click', () => {
        sendRealTimeChatMessage(reply);
      });
      container.appendChild(btn);
    });
  };

  function updateDynamicQuickReplies(suggestions) {
    const container = document.getElementById('chat-quick-replies-box');
    if (!container || !suggestions || suggestions.length === 0) return;
    container.innerHTML = '';

    suggestions.forEach(s => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'quick-reply-btn';
      btn.innerHTML = `<i class="fas fa-arrow-right" style="font-size: 0.65rem; opacity: 0.7;"></i> ${s}`;
      btn.addEventListener('click', () => {
        sendRealTimeChatMessage(s);
      });
      container.appendChild(btn);
    });
  }

  // Voice Assistant (Speech-to-Text)
  function initSpeechRecognition() {
    const chatMicBtn = document.getElementById('chat-mic-btn');
    if (!chatMicBtn) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognizer = new SpeechRecognition();
      recognizer.continuous = false;
      recognizer.interimResults = false;

      recognizer.onstart = () => {
        chatMicBtn.classList.add('recording');
        chatMicBtn.title = "Listening... speak now";
      };

      recognizer.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        const inputEl = document.getElementById('chat-input-text');
        if (inputEl) {
          inputEl.value = transcript;
          sendRealTimeChatMessage(transcript);
          inputEl.value = '';
        }
      };

      recognizer.onerror = () => {
        chatMicBtn.classList.remove('recording');
      };

      recognizer.onend = () => {
        chatMicBtn.classList.remove('recording');
        chatMicBtn.title = "Speak your query in real-time";
      };

      chatMicBtn.addEventListener('click', () => {
        if (chatMicBtn.classList.contains('recording')) {
          recognizer.stop();
        } else {
          const lang = getCurrentLang();
          recognizer.lang = lang === 'te' ? 'te-IN' : lang === 'hi' ? 'hi-IN' : 'en-IN';
          try {
            recognizer.start();
          } catch (e) {
            console.warn("Speech error:", e.message);
          }
        }
      });
    } else {
      chatMicBtn.style.display = 'none';
    }
  }

  // Initialize UI Bindings
  function initChatbotUI() {
    const chatbotTrigger = document.getElementById('chat-trigger-btn');
    const chatWindow = document.getElementById('chat-window-box');
    const closeBtn = document.getElementById('close-chat-btn');
    const inputForm = document.getElementById('chat-input-form');

    if (chatbotTrigger && chatWindow) {
      chatbotTrigger.addEventListener('click', () => {
        const isVisible = chatWindow.style.display === "flex";
        chatWindow.style.display = isVisible ? "none" : "flex";
        if (!isVisible) {
          setTimeout(() => document.getElementById('chat-input-text')?.focus(), 150);
          const container = document.getElementById('chat-messages-container');
          if (container && container.children.length === 0) {
            window.initChatbotGreeting();
          }
        }
      });
    }

    if (closeBtn && chatWindow) {
      closeBtn.addEventListener('click', () => {
        chatWindow.style.display = "none";
        if (window.speechSynthesis) window.speechSynthesis.cancel();
      });
    }

    if (inputForm) {
      inputForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const inputEl = document.getElementById('chat-input-text');
        if (!inputEl) return;
        const text = inputEl.value;
        inputEl.value = '';
        sendRealTimeChatMessage(text);
      });
    }

    initSpeechRecognition();
    window.renderChatbotQuickReplies();
    window.initChatbotGreeting();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChatbotUI);
  } else {
    initChatbotUI();
  }
})();
