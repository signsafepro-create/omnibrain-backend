const PORT = process.env.PORT || 3000;
const URL = `http://localhost:${PORT}`;

async function runTests() {
  console.log("Starting System Fix List Smoke & Integration Tests...\n");

  // 1. Health Endpoint
  console.log(`[Test 1] Health Endpoint (${URL}/api/v1/health)`);
  try {
    const res = await fetch(`${URL}/api/v1/health`);
    if (res.ok) {
      const data = await res.json();
      console.log("  ✅ PASSED:", JSON.stringify(data));
    } else {
      console.error("  ❌ FAILED with status:", res.status);
      process.exitCode = 1;
    }
  } catch (err) {
    console.error("  ❌ FAILED:", err.message);
    process.exitCode = 1;
  }

  // 2. Predict Candidate Endpoint
  console.log(`\n[Test 2] Prediction Candidate API (${URL}/api/v1/predict/candidates)`);
  try {
    const res = await fetch(`${URL}/api/v1/predict/candidates`);
    if (res.ok) {
      const data = await res.json();
      console.log(`  ✅ PASSED: Retrieved ${data.data?.length || 0} candidates`);
    } else {
      console.error("  ❌ FAILED with status:", res.status);
      process.exitCode = 1;
    }
  } catch (err) {
    console.error("  ❌ FAILED:", err.message);
    process.exitCode = 1;
  }

  // 3. Sovereign Agent Runtime Status
  console.log(`\n[Test 3] Sovereign Agent Telemetry (${URL}/api/v1/sovereign/status)`);
  try {
    const res = await fetch(`${URL}/api/v1/sovereign/status`);
    if (res.ok) {
      const data = await res.json();
      console.log("  ✅ PASSED: Agent status =", data.data?.agentStatus);
    } else {
      console.error("  ❌ FAILED with status:", res.status);
      process.exitCode = 1;
    }
  } catch (err) {
    console.error("  ❌ FAILED:", err.message);
    process.exitCode = 1;
  }

  // 4. Stripe Webhooks (/webhooks/stripe)
  console.log(`\n[Test 4] Stripe Webhook Endpoint (${URL}/webhooks/stripe)`);
  try {
    const res = await fetch(`${URL}/webhooks/stripe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "stripe-signature": "t=123,v1=test_sig"
      },
      body: JSON.stringify({ type: "checkout.session.completed", data: { object: { customer_email: "test@x-sovereign.com" } } })
    });
    // Expected to reject bad signature or return received: true
    if (res.ok || res.status === 400) {
      console.log(`  ✅ PASSED: Webhook processed with HTTP ${res.status}`);
    } else {
      console.error(`  ❌ FAILED with unexpected status: ${res.status}`);
      process.exitCode = 1;
    }
  } catch (err) {
    console.error("  ❌ FAILED:", err.message);
    process.exitCode = 1;
  }

  console.log("\n==========================================");
  if (process.exitCode === 1) {
    console.log("❌ Integration tests FAILED");
  } else {
    console.log("🎉 ALL INTEGRATION TESTS PASSED CLEANLY!");
  }
}

runTests();
