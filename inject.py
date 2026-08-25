import sys

with open('server.js', 'r') as f:
    content = f.read()

# Find the AI endpoint
start = content.find("app.post('/api/cognition/think'")
end = content.find("app.get('/api/cognition/history'")

if start == -1 or end == -1:
    print(f"ERROR: start={start}, end={end}")
    sys.exit(1)

before = content[:start]
after = content[end:]

new_endpoint = r"""app.post('/api/cognition/think', auth, async (req, res) => {
  const { input, mode, conversationHistory = [], previewDelivered = false } = req.body || {};
  if (!input) return res.status(400).json({ error: 'Input required' });

  const messageCount = conversationHistory.length + 1;

  const BASE_PERSONALITY = `You are Lil Jr 2.0 — the user's ride-or-die creative partner. You talk like a real best friend, not corporate AI.

RULES:
- Use casual language, slang, emojis. Be hype, be real.
- NEVER say "As an AI..." or sound robotic.
- Your job is to HELP them build their idea through conversation.
- Ask questions, suggest wild angles, challenge them, get excited WITH them.
- If they mention an app, ask who it's for and what problem it solves.
- If they mention a business, ask about the money model and audience.
- If they mention content, ask about vibe and platform.
- Bounce ideas back and forth. Build on what they say.
- Keep messages concise but energetic. Under 120 words unless generating a preview.
- Reference previous messages so they know you're listening.
- If they seem ready (say "show me", "preview", "let's do it", or the idea is solid after 6+ messages), offer to generate a preview.`;

  const PREVIEW_PROMPT = `You are Lil Jr 2.0. The user and you just brainstormed an idea together. Now generate a REAL, CONCRETE preview based on everything discussed.

Generate EXACTLY what fits their idea:
- App/Website -> React Native / HTML wireframe code block + feature list
- Business -> Business model canvas section + 90-day roadmap
- Content/Social -> Content calendar + caption examples + hashtag strategy
- Brand/Logo -> Design brief + color palette + mockup description
- Anything else -> Structured plan + actionable next steps

FORMAT:
🎨 YOUR PREVIEW:
[Concrete output — real code, real plan, real content. Make it GOOD.]

✨ WHAT LIL JR PRO UNLOCKS:
• The FULL build — complete source code, deployment-ready
• Unlimited AI sessions — no limits, build as many ideas as you want
• One-click deploy — push to live website or app store
• Custom branding, payments, auth — everything built for you

💎 Ready to make this real?
Upgrade to Lil Jr Pro and I'll build the complete version for you.

⚡ This was your free preview. Upgrade to unlock the full build + unlimited AI.`;

  const previewTriggers = ['show me', 'preview', 'let me see', 'generate', 'cook it up', 'build it', 'lets do it', "let's do it", 'make it real', 'i want this'];
  const wantsPreview = previewTriggers.some(t => input.toLowerCase().includes(t)) || (messageCount >= 8 && !previewDelivered);

  let systemPrompt = BASE_PERSONALITY;
  if (wantsPreview && !previewDelivered) {
    systemPrompt = PREVIEW_PROMPT;
  }

  const messages = [
    { role: 'system', content: systemPrompt },
    ...conversationHistory,
    { role: 'user', content: input }
  ];

  try {
    if (pool) {
      await pool.query('INSERT INTO messages (user_id, role, content) VALUES ($1, $2, $3)', [req.user.id, 'user', input]);
    }
  } catch (e) {
    console.error('Message save error:', e.message);
  }

  if (!GROQ_API_KEY) {
    return res.json({
      response: 'Groq API key not configured. Add GROQ_API_KEY to environment variables.',
      mode: mode || 'standard',
      model: 'none'
    });
  }

  try {
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + GROQ_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama3-70b-8192',
        messages: messages,
        temperature: 0.9,
        max_tokens: (wantsPreview && !previewDelivered) ? 2000 : 500
      })
    });

    if (!groqRes.ok) {
      const err = await groqRes.text();
      console.error('Groq error:', groqRes.status, err);
      return res.status(502).json({ error: 'AI service error', details: err });
    }

    const data = await groqRes.json();
    const reply = data.choices?.[0]?.message?.content || 'Yo my brain glitched, try again?';

    try {
      if (pool) {
        await pool.query('INSERT INTO messages (user_id, role, content) VALUES ($1, $2, $3)', [req.user.id, 'assistant', reply]);
      }
    } catch (e) {
      console.error('AI message save error:', e.message);
    }

    let paywallData = null;
    const isPreviewNow = wantsPreview && !previewDelivered;

    if (isPreviewNow) {
      paywallData = {
        triggered: true,
        tier: 'pro',
        upgrade_url: '/api/payments/checkout',
        features: [
          'Unlimited AI brainstorming & building',
          'Full code export + one-click deployment',
          'Custom builds & priority support'
        ],
        price: '$9.99/month'
      };
    }

    res.json({
      response: reply,
      message_count: messageCount,
      preview_delivered: isPreviewNow,
      paywall: paywallData,
      mode: mode || 'standard',
      model: 'llama3-70b-8192',
      tokens: data.usage?.total_tokens || 0,
      tier: req.user.tier || 'free'
    });

  } catch (e) {
    console.error('Think error:', e.message);
    res.status(500).json({ error: 'AI request failed', details: e.message });
  }
});

"""

new_content = before + new_endpoint + after

with open('server.js', 'w') as f:
    f.write(new_content)

print("SUCCESS: Conversion funnel injected into server.js")
