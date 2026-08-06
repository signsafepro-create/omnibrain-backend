const templates = {
  welcome: (name) => ({
    subject: 'Welcome to LIL.JR 2.0 Empire',
    html: `<!DOCTYPE html>
<html><body style="font-family:system-ui;background:#0a0a0a;color:#fff;padding:40px;">
  <div style="max-width:600px;margin:0 auto;border:1px solid #f97316;border-radius:16px;padding:40px;">
    <h1 style="color:#f97316;">🔥 Welcome, ${name}</h1>
    <p>Your AI Empire Command Center is live. 7 systems. One screen. Total control.</p>
    <a href="http://localhost/dashboard" style="display:inline-block;padding:12px 24px;background:#f97316;color:#000;text-decoration:none;border-radius:8px;font-weight:bold;">Open Command Deck</a>
  </div>
</body></html>`
  }),

  campaignLaunch: (name, campaignName) => ({
    subject: `🚀 ${campaignName} is LIVE`,
    html: `<!DOCTYPE html>
<html><body style="font-family:system-ui;background:#0a0a0a;color:#fff;padding:40px;">
  <div style="max-width:600px;margin:0 auto;border:1px solid #f97316;border-radius:16px;padding:40px;">
    <h1 style="color:#f97316;">Signal Fire Ignited 🔥</h1>
    <p>Hi ${name},</p>
    <p>Your campaign <strong>${campaignName}</strong> has been launched and is reaching your audience now.</p>
    <p style="color:#888;">Track performance in your Command Deck.</p>
  </div>
</body></html>`
  }),

  projectComplete: (name, projectName) => ({
    subject: `✅ ${projectName} is Ready`,
    html: `<!DOCTYPE html>
<html><body style="font-family:system-ui;background:#0a0a0a;color:#fff;padding:40px;">
  <div style="max-width:600px;margin:0 auto;border:1px solid #22c55e;border-radius:16px;padding:40px;">
    <h1 style="color:#22c55e;">Make It Real — Complete ✅</h1>
    <p>Hi ${name},</p>
    <p>Your project <strong>${projectName}</strong> has been built by all 11 AI agents.</p>
    <a href="http://localhost/brain" style="display:inline-block;padding:12px 24px;background:#22c55e;color:#000;text-decoration:none;border-radius:8px;font-weight:bold;">View Project</a>
  </div>
</body></html>`
  }),

  passwordReset: (name, token) => ({
    subject: 'Password Reset — LIL.JR 2.0',
    html: `<!DOCTYPE html>
<html><body style="font-family:system-ui;background:#0a0a0a;color:#fff;padding:40px;">
  <div style="max-width:600px;margin:0 auto;border:1px solid #ef4444;border-radius:16px;padding:40px;">
    <h1 style="color:#ef4444;">Security Alert</h1>
    <p>Hi ${name},</p>
    <p>We received a password reset request. Click below to reset:</p>
    <a href="http://localhost/reset?token=${token}" style="display:inline-block;padding:12px 24px;background:#ef4444;color:#fff;text-decoration:none;border-radius:8px;font-weight:bold;">Reset Password</a>
    <p style="color:#888;font-size:12px;">If you didn't request this, ignore this email.</p>
  </div>
</body></html>`
  })
};

module.exports = templates;
