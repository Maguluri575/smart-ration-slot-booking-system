const jwt = require('jsonwebtoken');

const testQueries = [
  { msg: 'how to book slot', lang: 'en' },
  { msg: 'can I reschedule if I miss my slot?', lang: 'en' },
  { msg: 'is ration free?', lang: 'en' },
  { msg: 'raashan slot kaise book kare', lang: 'hi' },
  { msg: 'రేషన్ స్లాట్ ఎలా బుక్ చేయాలి?', lang: 'te' },
  { msg: 'నా కోటా ఎంత?', lang: 'te' },
  { msg: 'what documents are required', lang: 'en' },
  { msg: 'shop timings', lang: 'en' },
  { msg: 'helpline number', lang: 'en' },
  { msg: 'senior citizen priority queue', lang: 'en' },
  { msg: 'without smartphone booking', lang: 'en' }
];

async function run() {
  console.log("=== TESTING GENERAL CUSTOMER DOUBTS ===");
  for (const q of testQueries) {
    const res = await fetch('http://localhost:3000/api/chatbot/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: q.msg, language: q.lang })
    });
    const data = await res.json();
    console.log(`Q: "${q.msg}" [${q.lang}] => Category: ${data.category} | Actions: ${data.actions?.length || 0}`);
  }

  console.log("\n=== TESTING AUTHENTICATED BENEFICIARY LIVE LOOKUP ===");
  // User 1: RATION999 (id: 1, role: 'beneficiary')
  const JWT_SECRET = 'smart_ration_system_jwt_token_secret_key_123';
  const token = jwt.sign({ id: 1, username: 'RATION999', role: 'beneficiary' }, JWT_SECRET, { expiresIn: '1h' });

  const authQueries = [
    { msg: 'what is my quota?', lang: 'en' },
    { msg: 'मेरा कोटा क्या है?', lang: 'hi' },
    { msg: 'when is my slot?', lang: 'en' },
    { msg: 'who is my dealer?', lang: 'en' }
  ];

  for (const q of authQueries) {
    const res = await fetch('http://localhost:3000/api/chatbot/message', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ message: q.msg, language: q.lang })
    });
    const data = await res.json();
    console.log(`Live Q: "${q.msg}" [${q.lang}] => Category: ${data.category}`);
    console.log(data.answer.substring(0, 120) + "...\n");
  }
}

run();
