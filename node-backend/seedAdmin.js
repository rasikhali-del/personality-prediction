import bcrypt from 'bcryptjs';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function seedAdmin() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'personality',
    charset: 'utf8mb4',
  });

  const adminEmail = 'admin@personality.com';
  const adminPassword = 'Admin@1234';
  const adminUsername = 'admin';

  const [existing] = await conn.execute('SELECT id FROM users WHERE email = ?', [adminEmail]);
  if (existing.length > 0) {
    console.log('ℹ️  Admin user already exists.');
    console.log(`📧  Email: ${adminEmail}`);
    console.log(`🔑  Password: ${adminPassword}`);
    await conn.end();
    return;
  }

  const hashed = await bcrypt.hash(adminPassword, 12);
  await conn.execute(
    'INSERT INTO users (username, email, password, is_admin) VALUES (?, ?, ?, ?)',
    [adminUsername, adminEmail, hashed, 1]
  );

  console.log('\n✅ Admin user created!');
  console.log('══════════════════════════════');
  console.log(`📧  Email:    ${adminEmail}`);
  console.log(`🔑  Password: ${adminPassword}`);
  console.log('══════════════════════════════\n');

  await conn.end();
}

seedAdmin().catch(err => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
