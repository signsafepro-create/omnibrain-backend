const express = require('express');
const router = express.Router();
const { authenticateToken } = require('./middleware/auth');

// Bridge to Python brain service (if running separately)
// Falls back to Groq API if Python brain is not available
const PYTHON_BRAIN_URL = process.env.PYTHON_BRAIN_URL || 'http://localhost:5000';

router.post('/analyze', authenticateToken, async (req, res) => {
  try {
    const { input, context } = req.body;

    // Try Python brain first
    try {
      const fetch = (await import('node-fetch')).default;
      const pyRes = await fetch(`${PYTHON_BRAIN_URL}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input, context, user_id: req.user.id }),
        timeout: 10000
      });
      if (pyRes.ok) {
        const data = await pyRes.json();
        return res.json({ source: 'python_brain', ...data });
      }
    } catch {
      // Python brain not available, use Groq
    }

    // Fallback: use Groq via existing service
    const groqService = require('./services/groqService');
    const result = await groqService.analyze(input, context);
    res.json({ source: 'groq', result });
  } catch (err) {
    console.error('Brain bridge error:', err);
    res.status(500).json({ error: 'Brain analysis failed.' });
  }
});

router.get('/status', authenticateToken, async (req, res) => {
  try {
    const fetch = (await import('node-fetch')).default;
    const pyRes = await fetch(`${PYTHON_BRAIN_URL}/health`, { timeout: 3000 });
    res.json({ python_brain: pyRes.ok, timestamp: new Date().toISOString() });
  } catch {
    res.json({ python_brain: false, fallback: 'groq', timestamp: new Date().toISOString() });
  }
});

module.exports = router;
