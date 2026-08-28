const { runAuthTests } = require('./auth.test');
const { runBrainTests } = require('./brain.test');
const { runWebsiteTests } = require('./website.test');
const { runEmailTests } = require('./email.test');
const { runDashboardTests } = require('./dashboard.test');
const { runPhoneTests } = require('./phone.test');
const { runChatbotTests } = require('./chatbot.test');
const { runRealWorldScenarios } = require('./real-world-scenarios');

async function runAllTests() {
  console.log('\n🔥🔥🔥 LIL.JR 2.0 EMPIRE — COMPLETE TEST SUITE 🔥🔥🔥');
  console.log('350 Points Total (50 per system) + 50 Real-World Scenarios');
  console.log('Testing against: http://localhost:3001\n');
  console.log('Make sure your server is running: node api/server.js\n');

  const results = [];

  results.push(await runAuthTests());
  results.push(await runBrainTests());
  results.push(await runWebsiteTests());
  results.push(await runEmailTests());
  results.push(await runDashboardTests());
  results.push(await runPhoneTests());
  results.push(await runChatbotTests());
  results.push(await runRealWorldScenarios());

  const totalPassed = results.reduce((sum, r) => sum + r.passed, 0);
  const totalTests = results.reduce((sum, r) => sum + r.total, 0);
  const percentage = Math.round(totalPassed / totalTests * 100);

  console.log('\n══════════════════════════════════════════════════');
  console.log('           🏆 FINAL EMPIRE SCORE 🏆');
  console.log('══════════════════════════════════════════════════');
  console.log(`   TOTAL: ${totalPassed}/${totalTests} passed (${percentage}%)`);
  console.log('──────────────────────────────────────────────────');
  console.log(`   🔐 Auth:        ${results[0].passed}/${results[0].total}`);
  console.log(`   🧠 Brain:       ${results[1].passed}/${results[1].total}`);
  console.log(`   🌐 Website:     ${results[2].passed}/${results[2].total}`);
  console.log(`   📧 Email:       ${results[3].passed}/${results[3].total}`);
  console.log(`   📊 Dashboard:   ${results[4].passed}/${results[4].total}`);
  console.log(`   📱 Phone:       ${results[5].passed}/${results[5].total}`);
  console.log(`   💬 Chatbot:     ${results[6].passed}/${results[6].total}`);
  console.log(`   🌍 Real-World:  ${results[7].passed}/${results[7].total}`);
  console.log('══════════════════════════════════════════════════');

  if (percentage >= 95) {
    console.log('   ✅ EMPIRE STATUS: PRODUCTION READY');
  } else if (percentage >= 80) {
    console.log('   ⚠️  EMPIRE STATUS: MINOR ISSUES — FIX AND RETEST');
  } else {
    console.log('   ❌ EMPIRE STATUS: CRITICAL FAILURES — DO NOT DEPLOY');
  }
  console.log('══════════════════════════════════════════════════\n');

  process.exit(percentage >= 80 ? 0 : 1);
}

runAllTests().catch(err => {
  console.error('Test runner crashed:', err);
  process.exit(1);
});
