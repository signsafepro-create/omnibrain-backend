const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function setup() {
  console.log('\n🔧 LIL.JR 2.0 EMPIRE SETUP\n');

  const required = ['.env.production', 'docker-compose.yml', 'nginx.conf', 'package.json'];
  const missing = required.filter(f => !fs.existsSync(f));

  if (missing.length > 0) {
    console.log('❌ Missing files:', missing.join(', '));
    console.log('Run: node deploy.js first');
    process.exit(1);
  }

  console.log('✅ All required files present');

  // Check Node.js
  try {
    const node = execSync('node --version', { encoding: 'utf8' }).trim();
    console.log('✅ Node.js:', node);
  } catch {
    console.log('❌ Node.js not found');
    process.exit(1);
  }

  // Check Docker
  try {
    const docker = execSync('docker --version', { encoding: 'utf8' }).trim();
    console.log('✅ Docker:', docker);
  } catch {
    console.log('⚠️  Docker not found — local mode only');
  }

  // Check .env
  const env = fs.readFileSync('.env.production', 'utf8');
  const placeholders = ['REPLACE', 'YOUR_KEY_HERE', 'MUST_REPLACE'];
  const hasPlaceholders = placeholders.some(p => env.includes(p));

  if (hasPlaceholders) {
    console.log('⚠️  .env.production still has placeholder values');
    console.log('   Replace: JWT_SECRET, DB_PASSWORD, STRIPE keys, RESEND key, TWILIO token');
  } else {
    console.log('✅ .env.production looks configured');
  }

  console.log('\n🔧 Setup complete. Run: node deploy.js');
}

setup();
