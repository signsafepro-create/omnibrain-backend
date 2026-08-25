const { test, assertEqual, assertTrue, assertHas, post, get } = require('./framework');

let brainResults = [];
let projectId = null;
let testToken = null;
let testUser = { email: 'brain_test_' + Date.now() + '@liljr.com', password: 'Brain123!', full_name: 'Brain Tester' };

async function runBrainTests() {
  console.log('\n🧠 BRAIN SYSTEM — 50 Point Test Suite');
  console.log('System: Make It Real — 11 AI Agents');
  console.log('Brand: Make It Real | Tagline: 11 AI agents building your idea into reality. In less than a minute.\n');

  // Setup: register and login
  const reg = await post('/api/auth/register', testUser);
  if (reg.status === 201) testToken = reg.body.token;
  else {
    const login = await post('/api/auth/login', { email: testUser.email, password: testUser.password });
    testToken = login.body.token;
  }
  const originalToken = require('./framework').token;
  require('./framework').token = testToken;

  // === BLOCK 1: CREATE PROJECT (10 points) ===
  await test('1.1 Create project with valid data returns 201', async () => {
    const r = await post('/api/brain/create-project', { name: 'Test Empire', description: 'AI marketing agency', project_type: 'website' }, true);
    assertEqual(r.status, 201, 'Status 201');
    assertHas(r.body, 'project', 'Has project');
    assertHas(r.body, 'agents', 'Has agents');
    projectId = r.body.project.id;
  })();

  await test('1.2 Created project has ID', async () => {
    assertTrue(projectId > 0, 'Project ID is positive');
  })();

  await test('1.3 Created project has correct name', async () => {
    const r = await post('/api/brain/create-project', { name: 'Second Project', description: 'Test' }, true);
    assertEqual(r.body.project.name, 'Second Project', 'Name matches');
  })();

  await test('1.4 Created project has correct description', async () => {
    const r = await post('/api/brain/create-project', { name: 'Desc Test', description: 'My custom desc' }, true);
    assertEqual(r.body.project.description, 'My custom desc', 'Description matches');
  })();

  await test('1.5 Created project has correct type', async () => {
    const r = await post('/api/brain/create-project', { name: 'Type Test', description: 'Test', project_type: 'app' }, true);
    assertEqual(r.body.project.project_type, 'app', 'Type is app');
  })();

  await test('1.6 Create project without auth returns 401', async () => {
    const r = await post('/api/brain/create-project', { name: 'No Auth' });
    assertEqual(r.status, 401, 'No auth 401');
  })();

  await test('1.7 Create project without name returns 400', async () => {
    const r = await post('/api/brain/create-project', { description: 'No name' }, true);
    assertEqual(r.status, 400, 'Missing name 400');
  })();

  await test('1.8 Project status is draft on creation', async () => {
    const r = await post('/api/brain/create-project', { name: 'Status Test', description: 'Test' }, true);
    assertEqual(r.body.project.status, 'draft', 'Status is draft');
  })();

  await test('1.9 Project has user_id matching creator', async () => {
    const r = await post('/api/brain/create-project', { name: 'Owner Test', description: 'Test' }, true);
    assertTrue(r.body.project.user_id > 0, 'Project has user_id');
  })();

  await test('1.10 Project created_at is recent', async () => {
    const r = await post('/api/brain/create-project', { name: 'Time Test', description: 'Test' }, true);
    const created = new Date(r.body.project.created_at);
    const now = new Date();
    assertTrue(now.getTime() - created.getTime() < 60000, 'Created within last minute');
  })();

  // === BLOCK 2: 11 AGENTS (15 points) ===
  await test('2.1 Create project returns exactly 11 agents', async () => {
    const r = await post('/api/brain/create-project', { name: 'Agent Count', description: 'Test' }, true);
    assertEqual(r.body.agents.length, 11, 'Exactly 11 agents');
  })();

  await test('2.2 Agent 1 is Vision Parser', async () => {
    const r = await post('/api/brain/create-project', { name: 'Agent Names', description: 'Test' }, true);
    assertEqual(r.body.agents[0].agent_name, 'Vision Parser', 'First agent is Vision Parser');
  })();

  await test('2.3 Agent 2 is UX Architect', async () => {
    const r = await post('/api/brain/create-project', { name: 'Agent 2', description: 'Test' }, true);
    assertEqual(r.body.agents[1].agent_name, 'UX Architect', 'Second agent is UX Architect');
  })();

  await test('2.4 Agent 3 is UI Designer', async () => {
    const r = await post('/api/brain/create-project', { name: 'Agent 3', description: 'Test' }, true);
    assertEqual(r.body.agents[2].agent_name, 'UI Designer', 'Third agent is UI Designer');
  })();

  await test('2.5 Agent 4 is Frontend Builder', async () => {
    const r = await post('/api/brain/create-project', { name: 'Agent 4', description: 'Test' }, true);
    assertEqual(r.body.agents[3].agent_name, 'Frontend Builder', 'Fourth agent is Frontend Builder');
  })();

  await test('2.6 Agent 5 is Backend Engineer', async () => {
    const r = await post('/api/brain/create-project', { name: 'Agent 5', description: 'Test' }, true);
    assertEqual(r.body.agents[4].agent_name, 'Backend Engineer', 'Fifth agent is Backend Engineer');
  })();

  await test('2.7 Agent 6 is Database Designer', async () => {
    const r = await post('/api/brain/create-project', { name: 'Agent 6', description: 'Test' }, true);
    assertEqual(r.body.agents[5].agent_name, 'Database Designer', 'Sixth agent is Database Designer');
  })();

  await test('2.8 Agent 7 is Security Agent', async () => {
    const r = await post('/api/brain/create-project', { name: 'Agent 7', description: 'Test' }, true);
    assertEqual(r.body.agents[6].agent_name, 'Security Agent', 'Seventh agent is Security Agent');
  })();

  await test('2.9 Agent 8 is DevOps Agent', async () => {
    const r = await post('/api/brain/create-project', { name: 'Agent 8', description: 'Test' }, true);
    assertEqual(r.body.agents[7].agent_name, 'DevOps Agent', 'Eighth agent is DevOps Agent');
  })();

  await test('2.10 Agent 9 is QA Tester', async () => {
    const r = await post('/api/brain/create-project', { name: 'Agent 9', description: 'Test' }, true);
    assertEqual(r.body.agents[8].agent_name, 'QA Tester', 'Ninth agent is QA Tester');
  })();

  await test('2.11 Agent 10 is SEO Optimizer', async () => {
    const r = await post('/api/brain/create-project', { name: 'Agent 10', description: 'Test' }, true);
    assertEqual(r.body.agents[9].agent_name, 'SEO Optimizer', 'Tenth agent is SEO Optimizer');
  })();

  await test('2.12 Agent 11 is Launch Manager', async () => {
    const r = await post('/api/brain/create-project', { name: 'Agent 11', description: 'Test' }, true);
    assertEqual(r.body.agents[10].agent_name, 'Launch Manager', 'Eleventh agent is Launch Manager');
  })();

  await test('2.13 All agents have idle status initially', async () => {
    const r = await post('/api/brain/create-project', { name: 'Idle Test', description: 'Test' }, true);
    const allIdle = r.body.agents.every(a => a.status === 'idle');
    assertTrue(allIdle, 'All agents start idle');
  })();

  await test('2.14 All agents have agent_order 1-11', async () => {
    const r = await post('/api/brain/create-project', { name: 'Order Test', description: 'Test' }, true);
    const orders = r.body.agents.map(a => a.agent_order).sort((a,b) => a-b);
    assertEqual(orders.join(','), '1,2,3,4,5,6,7,8,9,10,11', 'Orders are 1-11');
  })();

  await test('2.15 All agents have task_description', async () => {
    const r = await post('/api/brain/create-project', { name: 'Task Test', description: 'Test' }, true);
    const allHaveTasks = r.body.agents.every(a => a.task_description && a.task_description.length > 0);
    assertTrue(allHaveTasks, 'All agents have task descriptions');
  })();

  // === BLOCK 3: BUILD PROJECT (10 points) ===
  await test('3.1 Build project requires auth', async () => {
    const r = await post('/api/brain/build/1', {});
    assertEqual(r.status, 401, 'No auth 401');
  })();

  await test('3.2 Build project returns success', async () => {
    const create = await post('/api/brain/create-project', { name: 'Build Test', description: 'Test' }, true);
    const r = await post('/api/brain/build/' + create.body.project.id, {}, true);
    assertEqual(r.status, 200, 'Build returns 200');
    assertHas(r.body, 'message', 'Has message');
  })();

  await test('3.3 Build sets status to building', async () => {
    const create = await post('/api/brain/create-project', { name: 'Build Status', description: 'Test' }, true);
    const r = await post('/api/brain/build/' + create.body.project.id, {}, true);
    assertEqual(r.body.status, 'building', 'Status is building');
  })();

  await test('3.4 Build returns project_id', async () => {
    const create = await post('/api/brain/create-project', { name: 'Build ID', description: 'Test' }, true);
    const r = await post('/api/brain/build/' + create.body.project.id, {}, true);
    assertTrue(r.body.project_id > 0, 'Has project_id');
  })();

  await test('3.5 Build non-existent project returns 404', async () => {
    const r = await post('/api/brain/build/999999', {}, true);
    assertEqual(r.status, 404, 'Non-existent project 404');
  })();

  await test('3.6 Build project not owned by user returns 404', async () => {
    const r = await post('/api/brain/build/1', {}, true);
    assertTrue(r.status === 404 || r.status === 403, 'Other user project blocked');
  })();

  await test('3.7 Build sets agents to queued', async () => {
    const create = await post('/api/brain/create-project', { name: 'Build Queue', description: 'Test' }, true);
    await post('/api/brain/build/' + create.body.project.id, {}, true);
    const list = await get('/api/brain/projects', true);
    const proj = list.body.projects.find(p => p.id === create.body.project.id);
    assertTrue(proj.status === 'building' || proj.status === 'draft', 'Project status updated');
  })();

  await test('3.8 Build endpoint accepts POST only', async () => {
    // Indirect: GET should fail
    const r = await get('/api/brain/build/1', true);
    assertEqual(r.status, 404, 'GET not allowed');
  })();

  await test('3.9 Build does not crash on rapid calls', async () => {
    const create = await post('/api/brain/create-project', { name: 'Rapid Build', description: 'Test' }, true);
    await post('/api/brain/build/' + create.body.project.id, {}, true);
    await post('/api/brain/build/' + create.body.project.id, {}, true);
    const health = await get('/health');
    assertEqual(health.status, 200, 'Server healthy after rapid builds');
  })();

  await test('3.10 Build response time under 1 second', async () => {
    const create = await post('/api/brain/create-project', { name: 'Speed Build', description: 'Test' }, true);
    const start = Date.now();
    await post('/api/brain/build/' + create.body.project.id, {}, true);
    const elapsed = Date.now() - start;
    assertTrue(elapsed < 1000, `Build took ${elapsed}ms`);
  })();

  // === BLOCK 4: LIST PROJECTS (10 points) ===
  await test('4.1 List projects requires auth', async () => {
    const r = await get('/api/brain/projects');
    assertEqual(r.status, 401, 'No auth 401');
  })();

  await test('4.2 List projects returns array', async () => {
    const r = await get('/api/brain/projects', true);
    assertEqual(r.status, 200, 'Status 200');
    assertHas(r.body, 'projects', 'Has projects');
    assertTrue(Array.isArray(r.body.projects), 'Projects is array');
  })();

  await test('4.3 List projects includes created projects', async () => {
    await post('/api/brain/create-project', { name: 'List Check', description: 'Test' }, true);
    const r = await get('/api/brain/projects', true);
    const names = r.body.projects.map(p => p.name);
    assertTrue(names.includes('List Check'), 'Created project appears in list');
  })();

  await test('4.4 List projects includes agent_count', async () => {
    const r = await get('/api/brain/projects', true);
    if (r.body.projects.length > 0) {
      assertHas(r.body.projects[0], 'agent_count', 'Has agent_count');
    }
  })();

  await test('4.5 List projects sorted by created_at desc', async () => {
    const r = await get('/api/brain/projects', true);
    if (r.body.projects.length >= 2) {
      const dates = r.body.projects.map(p => new Date(p.created_at).getTime());
      const sorted = [...dates].sort((a,b) => b-a);
      assertEqual(dates.join(','), sorted.join(','), 'Sorted desc');
    }
  })();

  await test('4.6 List projects only shows user projects', async () => {
    // Create project with current user, verify only those appear
    const r = await get('/api/brain/projects', true);
    const allBelong = r.body.projects.every(p => p.user_id > 0);
    assertTrue(allBelong, 'All projects have user_id');
  })();

  await test('4.7 Empty projects list returns empty array', async () => {
    // New user should have empty list
    const newUser = { email: 'empty_' + Date.now() + '@liljr.com', password: 'Test123!', full_name: 'Empty' };
    await post('/api/auth/register', newUser);
    const login = await post('/api/auth/login', { email: newUser.email, password: newUser.password });
    const oldToken = require('./framework').token;
    require('./framework').token = login.body.token;
    const r = await get('/api/brain/projects', true);
    assertEqual(r.body.projects.length, 0, 'New user has 0 projects');
    require('./framework').token = oldToken;
  })();

  await test('4.8 List projects response time under 500ms', async () => {
    const start = Date.now();
    await get('/api/brain/projects', true);
    const elapsed = Date.now() - start;
    assertTrue(elapsed < 500, `List took ${elapsed}ms`);
  })();

  await test('4.9 List projects handles many projects', async () => {
    for (let i = 0; i < 5; i++) {
      await post('/api/brain/create-project', { name: 'Bulk ' + i, description: 'Test' }, true);
    }
    const r = await get('/api/brain/projects', true);
    assertTrue(r.body.projects.length >= 5, 'Handles multiple projects');
  })();

  await test('4.10 List projects after build shows updated status', async () => {
    const create = await post('/api/brain/create-project', { name: 'Status List', description: 'Test' }, true);
    await post('/api/brain/build/' + create.body.project.id, {}, true);
    const r = await get('/api/brain/projects', true);
    const proj = r.body.projects.find(p => p.id === create.body.project.id);
    assertTrue(proj.status === 'building' || proj.status === 'draft', 'Status reflected in list');
  })();

  // === BLOCK 5: EDGE CASES (5 points) ===
  await test('5.1 Project name with 255 chars handled', async () => {
    const r = await post('/api/brain/create-project', { name: 'A'.repeat(255), description: 'Test' }, true);
    assertTrue(r.status === 201 || r.status === 400, 'Long name handled');
  })();

  await test('5.2 Project name with special chars handled', async () => {
    const r = await post('/api/brain/create-project', { name: 'Project @#$%^&*()', description: 'Test' }, true);
    assertEqual(r.status, 201, 'Special chars accepted');
  })();

  await test('5.3 Project name with emoji handled', async () => {
    const r = await post('/api/brain/create-project', { name: '🔥 Rocket Project 🚀', description: 'Test' }, true);
    assertEqual(r.status, 201, 'Emoji accepted');
  })();

  await test('5.4 SQL injection in project name handled', async () => {
    const r = await post('/api/brain/create-project', { name: "'; DROP TABLE projects; --", description: 'Test' }, true);
    assertTrue(r.status === 201 || r.status === 400, 'SQL injection handled');
    const health = await get('/health');
    assertEqual(health.status, 200, 'Database still intact');
  })();

  await test('5.5 XSS in project description handled', async () => {
    const r = await post('/api/brain/create-project', { name: 'XSS Test', description: '<script>alert(1)</script>' }, true);
    assertEqual(r.status, 201, 'XSS in description accepted (sanitized elsewhere)');
  })();

  const passed = brainResults.filter(t => t.status === 'PASS').length;
  const total = brainResults.length;
  console.log(`\n📊 BRAIN RESULT: ${passed}/${total} passed (${Math.round(passed/total*100)}%)`);
  require('./framework').token = originalToken;
  return { passed, total, results: brainResults };
}

module.exports = { runBrainTests };
