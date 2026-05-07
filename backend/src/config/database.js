import mysql from "mysql2/promise";
import { env } from "./env.js";

const pool = mysql.createPool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10
});

async function initializeDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS assessments (
      id CHAR(36) PRIMARY KEY,
      number VARCHAR(50) NOT NULL,
      date DATE NOT NULL,
      client VARCHAR(255) NOT NULL,
      company VARCHAR(255) NOT NULL,
      client_responsible VARCHAR(255) NOT NULL,
      technician VARCHAR(255) NOT NULL,
      visit_type VARCHAR(100) NOT NULL,
      entry_time VARCHAR(5) NULL,
      exit_time VARCHAR(5) NULL,
      total_hours DECIMAL(10,2) NOT NULL DEFAULT 0,
      location VARCHAR(255) NULL,
      module VARCHAR(255) NOT NULL,
      training_done TEXT NULL,
      detailed_description TEXT NOT NULL,
      problems TEXT NULL,
      solutions TEXT NULL,
      pending TEXT NULL,
      next_steps TEXT NULL,
      notes TEXT NULL,
      technician_signature LONGTEXT NULL,
      client_signature LONGTEXT NULL,
      status ENUM('rascunho', 'finalizada', 'assinada', 'impressa') NOT NULL DEFAULT 'rascunho',
      created_at DATETIME NOT NULL,
      updated_at DATETIME NOT NULL
    )
  `);

  await ensureColumn("number", "VARCHAR(50) NOT NULL DEFAULT ''");
  await ensureColumn("date", "DATE NULL");
  await ensureColumn("client", "VARCHAR(255) NOT NULL DEFAULT ''");
  await ensureColumn("company", "VARCHAR(255) NOT NULL DEFAULT ''");
  await ensureColumn("client_responsible", "VARCHAR(255) NOT NULL DEFAULT ''");
  await ensureColumn("technician", "VARCHAR(255) NOT NULL DEFAULT ''");
  await ensureColumn("visit_type", "VARCHAR(100) NOT NULL DEFAULT ''");
  await ensureColumn("entry_time", "VARCHAR(5) NULL");
  await ensureColumn("exit_time", "VARCHAR(5) NULL");
  await ensureColumn("total_hours", "DECIMAL(10,2) NOT NULL DEFAULT 0");
  await ensureColumn("location", "VARCHAR(255) NULL");
  await ensureColumn("module", "VARCHAR(255) NOT NULL DEFAULT ''");
  await ensureColumn("training_done", "TEXT NULL");
  await ensureColumn("detailed_description", "TEXT NOT NULL");
  await ensureColumn("problems", "TEXT NULL");
  await ensureColumn("solutions", "TEXT NULL");
  await ensureColumn("pending", "TEXT NULL");
  await ensureColumn("next_steps", "TEXT NULL");
  await ensureColumn("notes", "TEXT NULL");
  await ensureColumn("technician_signature", "LONGTEXT NULL");
  await ensureColumn("client_signature", "LONGTEXT NULL");
  await ensureColumn(
    "status",
    "ENUM('rascunho', 'finalizada', 'assinada', 'impressa') NOT NULL DEFAULT 'rascunho'"
  );
  await pool.query(
    "ALTER TABLE assessments MODIFY COLUMN status ENUM('rascunho', 'finalizada', 'assinada', 'impressa') NOT NULL DEFAULT 'rascunho'"
  );
}

async function ensureColumn(columnName, definition) {
  const [rows] = await pool.query(
    `SELECT 1
     FROM information_schema.columns
     WHERE table_schema = DATABASE()
       AND table_name = 'assessments'
       AND column_name = ?`,
    [columnName]
  );

  if (rows.length === 0) {
    await pool.query(`ALTER TABLE assessments ADD COLUMN ${columnName} ${definition}`);
  }
}

export { pool, initializeDatabase };
