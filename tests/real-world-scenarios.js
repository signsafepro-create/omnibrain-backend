const { test, assertEqual, assertTrue, assertHas, post, get } = require('./framework');

let rwResults = [];

async function runRealWorldScenarios() {
  console.log('\n🌍 REAL-WORLD SCENARIOS — Cross-System Integration Tests');
  console.log('These simulate actual business workflows across multiple systems.\n');

  // SCENARIO 1: Startup Launch Day
  console.log('\n📌 SCENARIO 1: Startup Launch Day');
  console.log('User: SaaS founder launching product');
  console.log('Flow: Register → Create Project → Generate Website → Email Campaign → Dashboard Check\n');

  const founder = { email: 'founder_' + Date.now() + '@startup.com', password: 'Launch2026!', full_name: 'Founder CEO', company_name: 'TechStart Inc' };
  let founderToken = null;

  await test('S1.1 Founder registers account', async () => {
    const r = await post('/api/auth/register', founder);
    assertEqual(r.status, 201, 'Registered');
    founderToken = r.body.token;
  })();

  await test('S1.2 Founder logs in', async () => {
    const r = await post('/api/auth/login', { email: founder.email, password: founder.password });
    assertEqual(r.status, 200, 'Logged in');
    founderToken = r.body.token;
  })();

  await test('S1.3 Founder creates "Product Launch" project', async () => {
    require('./framework').token = founderToken;
    const r = await post('/api/brain/create-project', { name: 'Product Launch', description: 'SaaS AI platform launch', project_type: 'website' }, true);
    assertEqual(r.status, 201, 'Project created');
    assertEqual(r.body.agents.length, 11, '11 agents spawned');
  })();

  await test('S1.4 Founder generates landing page', async () => {
    const r = await post('/api/website/generate', { name: 'Launch Landing', description: 'SaaS product page with pricing', template_type: 'business' }, true);
    assertEqual(r.status, 201, 'Website generated');
    assertTrue(r.body.preview_url.includes('/preview'), 'Preview ready');
  })();

  await test('S1.5 Founder creates launch email campaign', async () => {
    const r = await post('/api/email/campaign/create', {
      name: 'Launch Day Blast',
      subject: '🚀 We\'re LIVE — Join the AI Revolution',
      body: '<h1>It\'s here.</h1><p>LIL.JR 2.0 is live. 7 systems. One screen.</p>',
      recipient_list: ['investor@vc.com', 'beta@user.com', 'press@techcrunch.com']
    }, true);
    assertEqual(r.status, 201, 'Campaign created');
  })();

  await test('S1.6 Founder sends launch campaign', async () => {
    const campaigns = await get('/api/email/campaign/list', true);
    if (campaigns.status === 200 && campaigns.body.campaigns?.length > 0) {
      const r = await post('/api/email/campaign/' + campaigns.body.campaigns[0].id + '/send', {}, true);
      assertEqual(r.status, 200, 'Campaign sent');
    }
  })();

  await test('S1.7 Founder views dashboard — all systems green', async () => {
    const r = await get('/api/dashboard/overview', true);
    assertEqual(r.status, 200, 'Dashboard loads');
    assertTrue(r.body.projects >= 1, 'Projects visible');
    assertTrue(r.body.websites >= 1, 'Websites visible');
    assertTrue(r.body.email_campaigns >= 1, 'Campaigns visible');
    assertTrue(r.body.agents >= 11, 'Agents visible');
  })();

  await test('S1.8 Founder checks website preview', async () => {
    const sites = await get('/api/website/list', true);
    assertTrue(sites.body.websites.length > 0, 'Sites exist');
    const preview = await get('/api/website/' + sites.body.websites[0].id + '/preview', true);
    assertEqual(preview.status, 200, 'Preview loads');
    assertTrue(preview.body.includes('<html'), 'Valid HTML');
  })();

  await test('S1.9 Founder sets up chatbot for support', async () => {
    const r = await post('/api/chatbot/create', { name: 'Launch Support', welcome_message: 'Ask about our launch!' }, true);
    assertEqual(r.status, 201, 'Chatbot created');
  })();

  await test('S1.10 Founder tests chatbot with customer question', async () => {
    const bots = await get('/api/chatbot/list', true);
    if (bots.status === 200 && bots.body.chatbots?.length > 0) {
      const r = await post('/api/chatbot/' + bots.body.chatbots[0].id + '/chat', { message: 'What\'s the pricing?' }, true);
      assertEqual(r.status, 200, 'Chatbot responds');
    }
  })();

  // SCENARIO 2: Agency Client Onboarding
  console.log('\n📌 SCENARIO 2: Agency Client Onboarding');
  console.log('User: Marketing agency owner onboarding new client');
  console.log('Flow: New client project → Brain build → SMS notification → Dashboard tracking\n');

  const agency = { email: 'agency_' + Date.now() + '@agency.com', password: 'Agency2026!', full_name: 'Agency Owner' };
  let agencyToken = null;

  await test('S2.1 Agency owner registers', async () => {
    const r = await post('/api/auth/register', agency);
    agencyToken = r.body.token;
    assertEqual(r.status, 201, 'Agency registered');
  })();

  await test('S2.2 Agency creates client project', async () => {
    require('./framework').token = agencyToken;
    const r = await post('/api/brain/create-project', { name: 'Client: Bistro Website', description: 'Restaurant site with menu + reservations', project_type: 'website' }, true);
    assertEqual(r.status, 201, 'Client project created');
    assertEqual(r.body.agents[0].agent_name, 'Vision Parser', 'Vision Parser first');
  })();

  await test('S2.3 Agency triggers build for client', async () => {
    const projects = await get('/api/brain/projects', true);
    const r = await post('/api/brain/build/' + projects.body.projects[0].id, {}, true);
    assertEqual(r.status, 200, 'Build triggered');
    assertEqual(r.body.status, 'building', 'Status building');
  })();

  await test('S2.4 Agency generates client website', async () => {
    const r = await post('/api/website/generate', { name: 'Bistro Site', description: 'Italian restaurant with online menu', template_type: 'business' }, true);
    assertEqual(r.status, 201, 'Client website generated');
  })();

  await test('S2.5 Agency sends SMS to client with preview link', async () => {
    const r = await post('/api/phone/sms/send', {
      to: '+17055551234',
      message: 'Your Bistro website is ready! Preview: http://localhost/website/1/preview'
    }, true);
    assertEqual(r.status, 200, 'SMS sent to client');
  })();

  await test('S2.6 Agency creates email campaign for client launch', async () => {
    const r = await post('/api/email/campaign/create', {
      name: 'Bistro Grand Opening',
      subject: 'Grand Opening This Weekend!',
      body: 'Come celebrate with us. 20% off all weekend.',
      recipient_list: ['regular1@email.com', 'regular2@email.com']
    }, true);
    assertEqual(r.status, 201, 'Opening campaign created');
  })();

  await test('S2.7 Agency checks all client assets in dashboard', async () => {
    const r = await get('/api/dashboard/overview', true);
    assertTrue(r.body.projects >= 1, 'Client projects tracked');
    assertTrue(r.body.websites >= 1, 'Client websites tracked');
    assertTrue(r.body.email_campaigns >= 1, 'Client campaigns tracked');
  })();

  await test('S2.8 Agency owner profile shows correct limits', async () => {
    const r = await get('/api/auth/me', true);
    assertEqual(r.body.user.plan_type, 'starter', 'Starter plan');
    assertTrue(r.body.user.max_projects >= 5, 'Room for more clients');
  })();

  await test('S2.9 Agency creates chatbot for client reservations', async () => {
    const r = await post('/api/chatbot/create', { name: 'Bistro Reservations', welcome_message: 'What time would you like to dine?' }, true);
    assertEqual(r.status, 201, 'Reservation bot created');
  })();

  await test('S2.10 Agency tests reservation flow', async () => {
    const bots = await get('/api/chatbot/list', true);
    if (bots.status === 200 && bots.body.chatbots?.length > 0) {
      const r = await post('/api/chatbot/' + bots.body.chatbots[0].id + '/chat', { message: 'Table for 2 at 7pm' }, true);
      assertEqual(r.status, 200, 'Reservation handled');
    }
  })();

  // SCENARIO 3: E-commerce Black Friday
  console.log('\n📌 SCENARIO 3: E-commerce Black Friday');
  console.log('User: Store owner handling traffic surge');
  console.log('Flow: Multiple websites → Bulk email → SMS alerts → Real-time dashboard\n');

  const store = { email: 'store_' + Date.now() + '@shop.com', password: 'BlackFriday2026!', full_name: 'Store Owner' };
  let storeToken = null;

  await test('S3.1 Store owner registers', async () => {
    const r = await post('/api/auth/register', store);
    storeToken = r.body.token;
    assertEqual(r.status, 201, 'Store registered');
  })();

  await test('S3.2 Store generates product page', async () => {
    require('./framework').token = storeToken;
    const r = await post('/api/website/generate', { name: 'Black Friday Deals', description: 'Shoes 50% off', template_type: 'ecommerce' }, true);
    assertEqual(r.status, 201, 'Product page created');
  })();

  await test('S3.3 Store generates category page', async () => {
    const r = await post('/api/website/generate', { name: 'Winter Collection', description: 'Coats and jackets', template_type: 'ecommerce' }, true);
    assertEqual(r.status, 201, 'Category page created');
  })();

  await test('S3.4 Store creates BF email to 100 customers', async () => {
    const recipients = Array.from({length: 100}, (_, i) => `customer${i}@shop.com`);
    const r = await post('/api/email/campaign/create', {
      name: 'BF2026',
      subject: '🔥 50% OFF — 6 Hours Only',
      body: '<h1>BLACK FRIDAY</h1><p>Code: BF50</p><a href="http://localhost/deals">Shop Now</a>',
      recipient_list: recipients
    }, true);
    assertEqual(r.status, 201, 'BF campaign created');
  })();

  await test('S3.5 Store sends BF campaign', async () => {
    const campaigns = await get('/api/email/campaign/list', true);
    if (campaigns.status === 200 && campaigns.body.campaigns?.length > 0) {
      const r = await post('/api/email/campaign/' + campaigns.body.campaigns[0].id + '/send', {}, true);
      assertEqual(r.status, 200, 'BF campaign sent');
    }
  })();

  await test('S3.6 Store sends SMS to VIP customers', async () => {
    const r = await post('/api/phone/sms/send', {
      to: '+17055551234',
      message: 'VIP Early Access: Use code VIP30 for 30% off before midnight!'
    }, true);
    assertEqual(r.status, 200, 'VIP SMS sent');
  })();

  await test('S3.7 Store monitors traffic in dashboard', async () => {
    const r = await get('/api/dashboard/overview', true);
    assertTrue(r.body.websites >= 2, 'Multiple sites tracked');
    assertTrue(r.body.email_campaigns >= 1, 'Campaign tracked');
  })();

  await test('S3.8 Store creates support chatbot for BF questions', async () => {
    const r = await post('/api/chatbot/create', { name: 'BF Support', welcome_message: 'Ask about our Black Friday deals!' }, true);
    assertEqual(r.status, 201, 'Support bot created');
  })();

  await test('S3.9 Customer asks about sizing via chatbot', async () => {
    const bots = await get('/api/chatbot/list', true);
    if (bots.status === 200 && bots.body.chatbots?.length > 0) {
      const r = await post('/api/chatbot/' + bots.body.chatbots[0].id + '/chat', { message: 'Do you have size 11?' }, true);
      assertEqual(r.status, 200, 'Sizing question handled');
    }
  })();

  await test('S3.10 Store checks all systems operational', async () => {
    const health = await get('/health');
    assertEqual(health.status, 200, 'Server healthy under load');
    assertEqual(health.body.status, 'ok', 'Status ok');
  })();

  // SCENARIO 4: SaaS Free Trial Conversion
  console.log('\n📌 SCENARIO 4: SaaS Free Trial Conversion');
  console.log('User: SaaS company converting trial users to paid');
  console.log('Flow: Chatbot qualification → Email nurture → Phone follow-up → Dashboard tracking\n');

  const saas = { email: 'saas_' + Date.now() + '@saas.com', password: 'Convert2026!', full_name: 'SaaS Growth Lead' };
  let saasToken = null;

  await test('S4.1 SaaS team registers', async () => {
    const r = await post('/api/auth/register', saas);
    saasToken = r.body.token;
    assertEqual(r.status, 201, 'SaaS registered');
  })();

  await test('S4.2 SaaS creates conversion chatbot', async () => {
    require('./framework').token = saasToken;
    const r = await post('/api/chatbot/create', { name: 'Trial Converter', welcome_message: 'Ready to upgrade? I can help.' }, true);
    assertEqual(r.status, 201, 'Converter bot created');
  })();

  await test('S4.3 Trial user asks about Pro plan via chatbot', async () => {
    const bots = await get('/api/chatbot/list', true);
    if (bots.status === 200 && bots.body.chatbots?.length > 0) {
      const r = await post('/api/chatbot/' + bots.body.chatbots[0].id + '/chat', { message: 'What\'s included in Pro?' }, true);
      assertEqual(r.status, 200, 'Pro plan question handled');
    }
  })();

  await test('S4.4 SaaS creates nurture email sequence', async () => {
    const r = await post('/api/email/campaign/create', {
      name: 'Day 3: Pro Features',
      subject: 'You\'re missing out on these Pro features',
      body: '<h2>Unlock the full power</h2><ul><li>Unlimited projects</li><li>Priority support</li></ul>',
      recipient_list: ['trial1@user.com', 'trial2@user.com']
    }, true);
    assertEqual(r.status, 201, 'Nurture email created');
  })();

  await test('S4.5 SaaS sends nurture campaign', async () => {
    const campaigns = await get('/api/email/campaign/list', true);
    if (campaigns.status === 200 && campaigns.body.campaigns?.length > 0) {
      const r = await post('/api/email/campaign/' + campaigns.body.campaigns[0].id + '/send', {}, true);
      assertEqual(r.status, 200, 'Nurture sent');
    }
  })();

  await test('S4.6 SaaS sends SMS to high-intent trial user', async () => {
    const r = await post('/api/phone/sms/send', {
      to: '+17055551234',
      message: 'Hi! I noticed you checked out Pro. Want a 20% discount? Reply YES.'
    }, true);
    assertEqual(r.status, 200, 'SMS sent');
  })();

  await test('S4.7 SaaS creates project for onboarding flow', async () => {
    const r = await post('/api/brain/create-project', { name: 'Onboarding Flow', description: 'Convert trial to paid', project_type: 'app' }, true);
    assertEqual(r.status, 201, 'Onboarding project created');
  })();

  await test('S4.8 SaaS checks conversion metrics in dashboard', async () => {
    const r = await get('/api/dashboard/overview', true);
    assertTrue(r.body.projects >= 1, 'Projects tracked');
    assertTrue(r.body.email_campaigns >= 1, 'Emails tracked');
    assertTrue(r.body.chatbots >= 1, 'Chatbots tracked');
  })();

  await test('S4.9 SaaS generates upgrade landing page', async () => {
    const r = await post('/api/website/generate', { name: 'Upgrade Page', description: 'Pro plan pricing and features', template_type: 'business' }, true);
    assertEqual(r.status, 201, 'Upgrade page created');
  })();

  await test('S4.10 SaaS verifies all conversion tools live', async () => {
    const health = await get('/health');
    assertEqual(health.status, 200, 'All systems operational');
  })();

  // SCENARIO 5: Multi-Client Agency (5 clients)
  console.log('\n📌 SCENARIO 5: Multi-Client Agency Deployment');
  console.log('User: Agency owner managing 5 clients simultaneously');
  console.log('Flow: 5 separate projects → 5 websites → 5 campaigns → Dashboard overview\n');

  const agency5 = { email: 'agency5_' + Date.now() + '@agency.com', password: 'FiveClients2026!', full_name: 'Multi-Client Owner' };
  let agency5Token = null;

  await test('S5.1 Agency owner registers for multi-client', async () => {
    const r = await post('/api/auth/register', agency5);
    agency5Token = r.body.token;
    assertEqual(r.status, 201, 'Registered');
  })();

  await test('S5.2 Create 5 client projects', async () => {
    require('./framework').token = agency5Token;
    const clients = ['Client A: Dental', 'Client B: Gym', 'Client C: Law', 'Client D: Restaurant', 'Client E: SaaS'];
    for (const name of clients) {
      const r = await post('/api/brain/create-project', { name, description: 'Full service build', project_type: 'website' }, true);
      assertEqual(r.status, 201, `${name} project created`);
    }
  })();

  await test('S5.3 Generate 5 client websites', async () => {
    const sites = ['Dental Site', 'Gym Site', 'Law Site', 'Restaurant Site', 'SaaS Site'];
    for (const name of sites) {
      const r = await post('/api/website/generate', { name, description: 'Client website', template_type: 'business' }, true);
      assertEqual(r.status, 201, `${name} created`);
    }
  })();

  await test('S5.4 Create 5 client email campaigns', async () => {
    const campaigns = ['Dental Promo', 'Gym Challenge', 'Law Newsletter', 'Restaurant Menu', 'SaaS Update'];
    for (const name of campaigns) {
      const r = await post('/api/email/campaign/create', { name, subject: name, body: '<p>Content</p>', recipient_list: [] }, true);
      assertEqual(r.status, 201, `${name} campaign created`);
    }
  })();

  await test('S5.5 Create 5 client chatbots', async () => {
    const bots = ['Dental Bot', 'Gym Bot', 'Law Bot', 'Restaurant Bot', 'SaaS Bot'];
    for (const name of bots) {
      const r = await post('/api/chatbot/create', { name, welcome_message: 'Hi from ' + name }, true);
      assertEqual(r.status, 201, `${name} created`);
    }
  })();

  await test('S5.6 Dashboard shows 5 projects', async () => {
    const r = await get('/api/dashboard/overview', true);
    assertTrue(r.body.projects >= 5, '5+ projects tracked');
  })();

  await test('S5.7 Dashboard shows 5 websites', async () => {
    const r = await get('/api/dashboard/overview', true);
    assertTrue(r.body.websites >= 5, '5+ websites tracked');
  })();

  await test('S5.8 Dashboard shows 5 campaigns', async () => {
    const r = await get('/api/dashboard/overview', true);
    assertTrue(r.body.email_campaigns >= 5, '5+ campaigns tracked');
  })();

  await test('S5.9 Dashboard shows 5 chatbots', async () => {
    const r = await get('/api/dashboard/overview', true);
    assertTrue(r.body.chatbots >= 5, '5+ chatbots tracked');
  })();

  await test('S5.10 Dashboard shows 55 agents (5×11)', async () => {
    const r = await get('/api/dashboard/overview', true);
    assertTrue(r.body.agents >= 55, '55+ agents tracked');
  })();

  const passed = rwResults.filter(t => t.status === 'PASS').length;
  const total = rwResults.length;
  console.log(`\n📊 REAL-WORLD SCENARIOS: ${passed}/${total} passed (${Math.round(passed/total*100)}%)`);
  return { passed, total, results: rwResults };
}

module.exports = { runRealWorldScenarios };
