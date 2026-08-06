const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function backup() {
  console.log('\n💾 LIL.JR 2.0 DATABASE BACKUP\n');

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.join(process.cwd(), 'backups');
  if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });

  const tables = ['users', 'projects', 'ai_agents', 'websites', 'email_campaigns', 'chatbots', 'sms_logs'];

  for (const table of tables) {
    try {
      const result = await pool.query(`SELECT * FROM ${table}`);
      const file = path.join(backupDir, `${table}_${timestamp}.json`);
      fs.writeFileSync(file, JSON.stringify(result.rows, null, 2));
      console.log(`✅ ${table}: ${result.rows.length} rows → ${file}`);
    } catch (err) {
      console.log(`❌ ${table}: ${err.message}`);
    }
  }

  await pool.end();
  console.log('\n💾 Backup complete in:', backupDir);
}

backup().catch(console.error);
