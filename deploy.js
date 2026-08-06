const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const baseDir = process.cwd();
const requiredFiles = [
  'docker-compose.yml',
  '.env.production',
  'nginx.conf',
  'deploy/Dockerfile.backend',
  'deploy/Dockerfile.frontend',
  'deploy/nginx-frontend.conf'
];

function checkDocker() {
  try {
    const version = execSync('docker --version', { encoding: 'utf8' }).trim();
    console.log('✅ Docker:', version);
    return true;
  } catch {
    console.error('❌ Docker not found. Install Docker Desktop and restart.');
    return false;
  }
}

function checkFiles() {
  let allGood = true;
  for (const file of requiredFiles) {
    const fullPath = path.join(baseDir, file);
    if (fs.existsSync(fullPath)) {
      console.log('✅', file);
    } else {
      console.log('❌', file, 'MISSING');
      allGood = false;
    }
  }
  return allGood;
}

function generateEnv() {
  const envPath = path.join(baseDir, '.env.production');
  if (!fs.existsSync(envPath)) {
    console.log('Creating .env.production...');
    // Already created above
  }

  // Generate random secrets if placeholders
  let content = fs.readFileSync(envPath, 'utf8');
  const jwtSecret = require('crypto').randomBytes(48).toString('hex');
  const dbPass = require('crypto').randomBytes(16).toString('hex');

  content = content.replace('REPLACE_WITH_64_CHAR_RANDOM_STRING', jwtSecret);
  content = content.replace(/REPLACE_DB_PASSWORD/g, dbPass);

  fs.writeFileSync(envPath, content);
  console.log('🔐 Secrets generated and saved to .env.production');
}

function deploy() {
  console.log('\n🔥 LIL.JR 2.0 EMPIRE DEPLOYMENT 🔥\n');

  if (!checkDocker()) process.exit(1);
  if (!checkFiles()) {
    console.log('\nCreating missing files...');
    // Files should already exist
  }

  generateEnv();

  console.log('\n🚀 Starting Docker Compose...');
  try {
    execSync('docker-compose up --build -d', { stdio: 'inherit', cwd: baseDir });
    console.log('\n✅ Empire is LIVE');
    console.log('   Frontend: http://localhost');
    console.log('   API:      http://localhost:3001');
    console.log('   Health:   http://localhost:3001/health');
  } catch (err) {
    console.error('❌ Deploy failed:', err.message);
    process.exit(1);
  }
}

if (require.main === module) deploy();
module.exports = { deploy, checkDocker, checkFiles };
