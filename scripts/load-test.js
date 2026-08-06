const http = require('http');

const CONCURRENT = 50;
const REQUESTS = 200;
const TARGET = 'http://localhost:8080/health';

async function loadTest() {
  console.log(`\n⚡ LIL.JR 2.0 LOAD TEST`);
  console.log(`Target: ${TARGET}`);
  console.log(`Concurrent: ${CONCURRENT}, Total: ${REQUESTS}\n`);

  let completed = 0;
  let failed = 0;
  const times = [];
  const start = Date.now();

  async function fire() {
    const reqStart = Date.now();
    try {
      await new Promise((resolve, reject) => {
        http.get(TARGET, res => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => {
            if (res.statusCode === 200) resolve(data);
            else reject(new Error(`Status ${res.statusCode}`));
          });
        }).on('error', reject).setTimeout(5000, () => reject(new Error('Timeout')));
      });
      times.push(Date.now() - reqStart);
      completed++;
    } catch {
      failed++;
    }
  }

  const batches = [];
  for (let i = 0; i < REQUESTS; i += CONCURRENT) {
    const batch = Array.from({ length: Math.min(CONCURRENT, REQUESTS - i) }, () => fire());
    batches.push(Promise.all(batch));
  }

  await Promise.all(batches);

  const elapsed = Date.now() - start;
  const avg = times.reduce((a,b) => a+b, 0) / times.length;
  const max = Math.max(...times);
  const min = Math.min(...times);

  console.log(`✅ Completed: ${completed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`⏱️  Total time: ${elapsed}ms`);
  console.log(`⚡ RPS: ${(completed / (elapsed/1000)).toFixed(1)}`);
  console.log(`📊 Avg: ${avg.toFixed(1)}ms | Min: ${min}ms | Max: ${max}ms`);

  if (failed === 0 && avg < 100) {
    console.log('\n🏆 LOAD TEST: EXCELLENT');
  } else if (failed < 5 && avg < 500) {
    console.log('\n✅ LOAD TEST: PASS');
  } else {
    console.log('\n⚠️ LOAD TEST: NEEDS OPTIMIZATION');
  }
}

loadTest().catch(console.error);
