const http = require('http');

const CHECKS = [
  { name: 'Server Health', path: '/api/health', expect: 200 },
  { name: 'Auth Signup', path: '/api/auth/signup', method: 'POST', body: { email: 'health@check.com', password: 'Test123!', name: 'Health Check' }, expect: 200 },
  { name: 'Auth Login', path: '/api/auth/login', method: 'POST', body: { email: 'health@check.com', password: 'Test123!' }, expect: 200 },
  { name: 'Dashboard', path: '/api/dashboard/overview', expect: 200 },
  { name: 'Brain Projects', path: '/api/brain/projects', expect: 200 },
  { name: 'Website List', path: '/api/website/list', expect: 200 },
];

async function check() {
  console.log('\n🏥 LIL.JR 2.0 HEALTH CHECK\n');
  let passed = 0;

  for (const check of CHECKS) {
    try {
      const opts = {
hostname: 'localhost',
       port: 3001,
        path: check.path,
        method: check.method || 'GET',
        headers: { 'Content-Type': 'application/json' }
      };

      const result = await new Promise((resolve, reject) => {
        const req = http.request(opts, res => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => resolve({ status: res.statusCode, body: data }));
        });
        req.on('error', reject);
        if (check.body) req.write(JSON.stringify(check.body));
        req.end();
      });

      const ok = result.status === check.expect;
      console.log(`${ok ? '✅' : '❌'} ${check.name}: ${result.status} (expected ${check.expect})`);
      if (ok) passed++;
    } catch (err) {
      console.log(`❌ ${check.name}: ${err.message}`);
    }
  }

  console.log(`\n📊 ${passed}/${CHECKS.length} checks passed`);
  process.exit(passed === CHECKS.length ? 0 : 1);
}

check();
