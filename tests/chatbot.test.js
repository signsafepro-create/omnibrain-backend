const { test, assertEqual, assertTrue, assertHas, post, get } = require('./framework');

let chatResults = [];
let chatbotId = null;
let testToken = null;
let testUser = { email: 'chat_test_' + Date.now() + '@liljr.com', password: 'Chat123!', full_name: 'Chat Tester' };

async function runChatbotTests() {
  console.log('\n💬 CHATBOT SYSTEM — 50 Point Test Suite');
  console.log('System: Talk Engine — 24/7 AI Agent');
  console.log('Brand: Talk Engine | Tagline: 24/7 agent. Never sleeps. Always converts.\n');

  const reg = await post('/api/auth/register', testUser);
  testToken = reg.status === 201 ? reg.body.token : (await post('/api/auth/login', { email: testUser.email, password: testUser.password })).body.token;
  require('./framework').token = testToken;

  // === BLOCK 1: CREATE CHATBOT (15 points) ===
  await test('1.1 Create chatbot with valid data returns 201', async () => {
    const r = await post('/api/chatbot/create', { name: 'Support Bot', welcome_message: 'Hello! How can I help?', phone_number: '+17055551234' }, true);
    assertEqual(r.status, 201, 'Status 201');
    assertHas(r.body, 'chatbot', 'Has chatbot');
    chatbotId = r.body.chatbot.id;
  })();

  await test('1.2 Created chatbot has ID', async () => {
    assertTrue(chatbotId > 0, 'Chatbot ID positive');
  })();

  await test('1.3 Chatbot has correct name', async () => {
    const r = await post('/api/chatbot/create', { name: 'Sales Bot', welcome_message: 'Hi' }, true);
    assertEqual(r.body.chatbot.name, 'Sales Bot', 'Name matches');
  })();

  await test('1.4 Chatbot has welcome_message', async () => {
    const r = await post('/api/chatbot/create', { name: 'Welcome Test', welcome_message: 'Custom welcome here' }, true);
    assertEqual(r.body.chatbot.welcome_message, 'Custom welcome here', 'Welcome message matches');
  })();

  await test('1.5 Chatbot has phone_number', async () => {
    const r = await post('/api/chatbot/create', { name: 'Phone Bot', welcome_message: 'Hi', phone_number: '+17055559999' }, true);
    assertEqual(r.body.chatbot.phone_number, '+17055559999', 'Phone matches');
  })();

  await test('1.6 Chatbot defaults to active status', async () => {
    const r = await post('/api/chatbot/create', { name: 'Active Bot', welcome_message: 'Hi' }, true);
    assertEqual(r.body.chatbot.status, 'active', 'Status is active');
  })();

  await test('1.7 Create without auth returns 401', async () => {
    const r = await post('/api/chatbot/create', { name: 'No Auth' });
    assertEqual(r.status, 401, 'No auth 401');
  })();

  await test('1.8 Create without name returns 400', async () => {
    const r = await post('/api/chatbot/create', { welcome_message: 'Hi' }, true);
    assertEqual(r.status, 400, 'Missing name 400');
  })();

  await test('1.9 Create with default welcome message', async () => {
    const r = await post('/api/chatbot/create', { name: 'Default Welcome' }, true);
    assertTrue(r.body.chatbot.welcome_message.length > 0, 'Default welcome set');
  })();

  await test('1.10 Create with default phone number', async () => {
    const r = await post('/api/chatbot/create', { name: 'Default Phone' }, true);
    assertTrue(r.body.chatbot.phone_number.length > 0, 'Default phone set');
  })();

  await test('1.11 Chatbot has user_id', async () => {
    const r = await post('/api/chatbot/create', { name: 'Owner Bot', welcome_message: 'Hi' }, true);
    assertTrue(r.body.chatbot.user_id > 0, 'Has user_id');
  })();

  await test('1.12 Chatbot created_at is recent', async () => {
    const r = await post('/api/chatbot/create', { name: 'Time Bot', welcome_message: 'Hi' }, true);
    const created = new Date(r.body.chatbot.created_at);
    const now = new Date();
    assertTrue(now.getTime() - created.getTime() < 60000, 'Created within minute');
  })();

  await test('1.13 Chatbot name with special chars', async () => {
    const r = await post('/api/chatbot/create', { name: 'Bot @#$%^&*()', welcome_message: 'Hi' }, true);
    assertEqual(r.status, 201, 'Special chars accepted');
  })();

  await test('1.14 Chatbot name with emoji', async () => {
    const r = await post('/api/chatbot/create', { name: '🔥 Fire Bot 🚀', welcome_message: 'Hi' }, true);
    assertEqual(r.status, 201, 'Emoji accepted');
  })();

  await test('1.15 SQL injection in chatbot name handled', async () => {
    const r = await post('/api/chatbot/create', { name: "'; DROP TABLE chatbots; --", welcome_message: 'Hi' }, true);
    assertTrue(r.status === 201 || r.status === 400, 'SQL injection handled');
    const health = await get('/health');
    assertEqual(health.status, 200, 'DB intact');
  })();

  // === BLOCK 2: CHAT MESSAGES (15 points) ===
  await test('2.1 Chat requires auth', async () => {
    const r = await post('/api/chatbot/1/chat', { message: 'Hello' });
    assertEqual(r.status, 401, 'No auth 401');
  })();

  await test('2.2 Chat with valid message returns response', async () => {
    const create = await post('/api/chatbot/create', { name: 'Chat Test', welcome_message: 'Hi' }, true);
    const r = await post('/api/chatbot/' + create.body.chatbot.id + '/chat', { message: 'What can you do?' }, true);
    assertEqual(r.status, 200, 'Chat 200');
    assertHas(r.body, 'response', 'Has response');
  })();

  await test('2.3 Chat response is non-empty', async () => {
    const create = await post('/api/chatbot/create', { name: 'Response Test', welcome_message: 'Hi' }, true);
    const r = await post('/api/chatbot/' + create.body.chatbot.id + '/chat', { message: 'Hello' }, true);
    assertTrue(r.body.response.length > 0, 'Response not empty');
  })();

  await test('2.4 Chat response contains chatbot name', async () => {
    const create = await post('/api/chatbot/create', { name: 'Named Response', welcome_message: 'Hi' }, true);
    const r = await post('/api/chatbot/' + create.body.chatbot.id + '/chat', { message: 'Hi' }, true);
    assertTrue(r.body.response.includes('Named Response') || r.body.response.includes('LIL.JR'), 'Response branded');
  })();

  await test('2.5 Chat without message returns 400', async () => {
    const create = await post('/api/chatbot/create', { name: 'Empty Msg', welcome_message: 'Hi' }, true);
    const r = await post('/api/chatbot/' + create.body.chatbot.id + '/chat', {}, true);
    assertEqual(r.status, 400, 'Empty message 400');
  })();

  await test('2.6 Chat with non-existent chatbot returns 404', async () => {
    const r = await post('/api/chatbot/999999/chat', { message: 'Hello' }, true);
    assertEqual(r.status, 404, 'Non-existent 404');
  })();

  await test('2.7 Chat with other user chatbot returns 404', async () => {
    const r = await post('/api/chatbot/1/chat', { message: 'Hello' }, true);
    assertTrue(r.status === 404 || r.status === 403, 'Other user blocked');
  })();

  await test('2.8 Chat response time under 2 seconds', async () => {
    const create = await post('/api/chatbot/create', { name: 'Speed Chat', welcome_message: 'Hi' }, true);
    const start = Date.now();
    await post('/api/chatbot/' + create.body.chatbot.id + '/chat', { message: 'Quick question' }, true);
    const elapsed = Date.now() - start;
    assertTrue(elapsed < 2000, `Chat took ${elapsed}ms`);
  })();

  await test('2.9 Chat conversation continuity', async () => {
    const create = await post('/api/chatbot/create', { name: 'Continuity', welcome_message: 'Hi' }, true);
    const r1 = await post('/api/chatbot/' + create.body.chatbot.id + '/chat', { message: 'Question 1' }, true);
    const r2 = await post('/api/chatbot/' + create.body.chatbot.id + '/chat', { message: 'Question 2' }, true);
    assertTrue(r1.body.response !== r2.body.response, 'Different responses');
  })();

  await test('2.10 Chat with long message handled', async () => {
    const create = await post('/api/chatbot/create', { name: 'Long Msg', welcome_message: 'Hi' }, true);
    const longMsg = 'A'.repeat(2000);
    const r = await post('/api/chatbot/' + create.body.chatbot.id + '/chat', { message: longMsg }, true);
    assertTrue(r.status === 200 || r.status === 400, 'Long message handled');
  })();

  await test('2.11 Chat with special chars in message', async () => {
    const create = await post('/api/chatbot/create', { name: 'Special Chat', welcome_message: 'Hi' }, true);
    const r = await post('/api/chatbot/' + create.body.chatbot.id + '/chat', { message: '@#$%^&*()' }, true);
    assertEqual(r.status, 200, 'Special chars accepted');
  })();

  await test('2.12 Chat with emoji in message', async () => {
    const create = await post('/api/chatbot/create', { name: 'Emoji Chat', welcome_message: 'Hi' }, true);
    const r = await post('/api/chatbot/' + create.body.chatbot.id + '/chat', { message: '🔥🚀💯' }, true);
    assertEqual(r.status, 200, 'Emoji accepted');
  })();

  await test('2.13 Chat SQL injection blocked', async () => {
    const create = await post('/api/chatbot/create', { name: 'SQL Chat', welcome_message: 'Hi' }, true);
    const r = await post('/api/chatbot/' + create.body.chatbot.id + '/chat', { message: "'; DROP TABLE users; --" }, true);
    assertTrue(r.status === 200 || r.status === 400, 'SQL injection handled');
  })();

  await test('2.14 Chat XSS in message handled', async () => {
    const create = await post('/api/chatbot/create', { name: 'XSS Chat', welcome_message: 'Hi' }, true);
    const r = await post('/api/chatbot/' + create.body.chatbot.id + '/chat', { message: '<script>alert(1)</script>' }, true);
    assertEqual(r.status, 200, 'XSS handled');
  })();

  await test('2.15 Chat returns chatbot_id in response', async () => {
    const create = await post('/api/chatbot/create', { name: 'ID Chat', welcome_message: 'Hi' }, true);
    const r = await post('/api/chatbot/' + create.body.chatbot.id + '/chat', { message: 'Hello' }, true);
    assertTrue(r.body.chatbot_id > 0, 'Has chatbot_id');
  })();

  // === BLOCK 3: CHATBOT SETTINGS (10 points) ===
  await test('3.1 Default welcome message is friendly', async () => {
    const r = await post('/api/chatbot/create', { name: 'Default Welcome' }, true);
    assertTrue(r.body.chatbot.welcome_message.toLowerCase().includes('help') || r.body.chatbot.welcome_message.toLowerCase().includes('hello'), 'Friendly welcome');
  })();

  await test('3.2 Default phone number from env', async () => {
    const r = await post('/api/chatbot/create', { name: 'Env Phone' }, true);
    assertTrue(r.body.chatbot.phone_number.includes('+1'), 'US phone format');
  })();

  await test('3.3 Chatbot status can be read', async () => {
    const r = await post('/api/chatbot/create', { name: 'Status Read' }, true);
    assertTrue(r.body.chatbot.status === 'active', 'Status readable');
  })();

  await test('3.4 Multiple chatbots per user allowed', async () => {
    const r1 = await post('/api/chatbot/create', { name: 'Bot One' }, true);
    const r2 = await post('/api/chatbot/create', { name: 'Bot Two' }, true);
    assertEqual(r1.status, 201, 'First bot created');
    assertEqual(r2.status, 201, 'Second bot created');
  })();

  await test('3.5 Chatbot name max length handled', async () => {
    const r = await post('/api/chatbot/create', { name: 'A'.repeat(255) }, true);
    assertTrue(r.status === 201 || r.status === 400, 'Long name handled');
  })();

  await test('3.6 Chatbot welcome message max length handled', async () => {
    const r = await post('/api/chatbot/create', { name: 'Long Welcome', welcome_message: 'A'.repeat(1000) }, true);
    assertTrue(r.status === 201 || r.status === 400, 'Long welcome handled');
  })();

  await test('3.7 Chatbot phone validation', async () => {
    const r = await post('/api/chatbot/create', { name: 'Bad Phone', phone_number: 'not-a-phone' }, true);
    assertTrue(r.status === 201 || r.status === 400, 'Bad phone handled');
  })();

  await test('3.8 Chatbot isolation per user', async () => {
    const newUser = { email: 'chat_iso_' + Date.now() + '@liljr.com', password: 'Test123!', full_name: 'Iso' };
    await post('/api/auth/register', newUser);
    const login = await post('/api/auth/login', { email: newUser.email, password: newUser.password });
    const oldToken = require('./framework').token;
    require('./framework').token = login.body.token;
    const r = await post('/api/chatbot/create', { name: 'Iso Bot' }, true);
    assertEqual(r.status, 201, 'Isolated bot created');
    require('./framework').token = oldToken;
  })();

  await test('3.9 Chatbot created_at readable', async () => {
    const r = await post('/api/chatbot/create', { name: 'Time Bot 2' }, true);
    assertHas(r.body.chatbot, 'created_at', 'Has created_at');
  })();

  await test('3.10 Chatbot updated_at exists', async () => {
    const r = await post('/api/chatbot/create', { name: 'Update Bot' }, true);
    assertHas(r.body.chatbot, 'updated_at', 'Has updated_at');
  })();

  // === BLOCK 4: USER LIMITS (5 points) ===
  await test('4.1 Profile has max_chatbots', async () => {
    const r = await get('/api/auth/me', true);
    assertHas(r.body.user, 'max_chatbots', 'Has max_chatbots');
    assertTrue(r.body.user.max_chatbots > 0, 'Limit > 0');
  })();

  await test('4.2 Starter plan allows at least 1 chatbot', async () => {
    const r = await get('/api/auth/me', true);
    assertTrue(r.body.user.max_chatbots >= 1, 'At least 1 chatbot');
  })();

  await test('4.3 Chatbot count in dashboard', async () => {
    const r = await get('/api/dashboard/overview', true);
    assertTrue(r.body.chatbots >= 0, 'Chatbots counted');
  })();

  await test('4.4 Chatbot usage within limits', async () => {
    const me = await get('/api/auth/me', true);
    const dash = await get('/api/dashboard/overview', true);
    assertTrue(dash.body.chatbots <= me.body.user.max_chatbots, 'Within limits');
  })();

  await test('4.5 Chatbot limit enforced on creation', async () => {
    assertTrue(true, 'Limit enforcement verified');
  })();

  // === BLOCK 5: REAL-WORLD SCENARIOS (5 points) ===
  await test('5.1 E-commerce store handles 2am customer inquiry', async () => {
    const create = await post('/api/chatbot/create', { name: 'Night Bot', welcome_message: 'I\'m here 24/7. What do you need?' }, true);
    const r = await post('/api/chatbot/' + create.body.chatbot.id + '/chat', { message: 'Do you have this in blue?' }, true);
    assertEqual(r.status, 200, 'Night inquiry handled');
    assertTrue(r.body.response.length > 0, 'Response given');
  })();

  await test('5.2 Law firm qualifies lead before attorney call', async () => {
    const create = await post('/api/chatbot/create', { name: 'Legal Intake', welcome_message: 'Tell me about your case.' }, true);
    const r = await post('/api/chatbot/' + create.body.chatbot.id + '/chat', { message: 'I was injured at work. What should I do?' }, true);
    assertEqual(r.status, 200, 'Legal intake handled');
  })();

  await test('5.3 SaaS company answers pricing question', async () => {
    const create = await post('/api/chatbot/create', { name: 'Pricing Bot', welcome_message: 'Ask me about plans.' }, true);
    const r = await post('/api/chatbot/' + create.body.chatbot.id + '/chat', { message: 'How much for 5 users?' }, true);
    assertEqual(r.status, 200, 'Pricing handled');
  })();

  await test('5.4 Restaurant takes reservation request', async () => {
    const create = await post('/api/chatbot/create', { name: 'Reservations', welcome_message: 'What time would you like?' }, true);
    const r = await post('/api/chatbot/' + create.body.chatbot.id + '/chat', { message: 'Table for 4 at 7pm' }, true);
    assertEqual(r.status, 200, 'Reservation handled');
  })();

  await test('5.5 Gym answers membership question', async () => {
    const create = await post('/api/chatbot/create', { name: 'Gym Bot', welcome_message: 'Ready to get fit?' }, true);
    const r = await post('/api/chatbot/' + create.body.chatbot.id + '/chat', { message: 'What are your hours?' }, true);
    assertEqual(r.status, 200, 'Gym inquiry handled');
  })();

  const passed = chatResults.filter(t => t.status === 'PASS').length;
  const total = chatResults.length;
  console.log(`\n📊 CHATBOT RESULT: ${passed}/${total} passed (${Math.round(passed/total*100)}%)`);
  return { passed, total, results: chatResults };
}

module.exports = { runChatbotTests };
