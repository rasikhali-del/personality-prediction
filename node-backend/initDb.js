import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function initDb() {
  const dbName = process.env.DB_NAME || 'personality';

  console.log(`\n🗄️  Initializing database: ${dbName}`);

  // First connect without database to create it if needed
  let conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    charset: 'utf8mb4',
  });

  // Create database
  await conn.execute(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  console.log(`✅ Database '${dbName}' ready`);
  
  await conn.end();

  // Now reconnect to the specific database
  conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: dbName,
    charset: 'utf8mb4',
  });

  // ── users table ──────────────────────────────────────────────────
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id           INT AUTO_INCREMENT PRIMARY KEY,
      username     VARCHAR(150) NOT NULL UNIQUE,
      email        VARCHAR(255) NOT NULL UNIQUE,
      password     VARCHAR(255) NOT NULL,
      is_admin     TINYINT(1)   NOT NULL DEFAULT 0,
      is_active    TINYINT(1)   NOT NULL DEFAULT 1,
      created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  console.log('✅ Table: users');

  // ── test_results table ───────────────────────────────────────────
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS test_results (
      id               INT AUTO_INCREMENT PRIMARY KEY,
      user_id          INT NOT NULL,
      text_result      JSON,
      voice_result     JSON,
      face_result      JSON,
      fusion_result    JSON,
      modalities_used  JSON,
      created_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      CONSTRAINT fk_test_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  console.log('✅ Table: test_results');

  await conn.end();
  console.log('\n🎉 Database initialization complete!\n');
}

initDb().catch((err) => {
  console.error('❌ Database initialization failed:', err.message);
  process.exit(1);
});
