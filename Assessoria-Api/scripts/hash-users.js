import dotenv from "dotenv";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

dotenv.config({ override: true });

const PASSWORD_BY_USERNAME = {
  rafael: "123456",
  marina: "123456",
  diego: "123456",
  admin: "admin123"
};

function isBcryptHash(value) {
  return /^\$2[aby]\$\d{2}\$/.test(String(value || ""));
}

async function main() {
  const dbPassword = String(process.env.DB_PASSWORD || "").replace(/^['"]|['"]$/g, "");

  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: dbPassword,
    database: process.env.DB_NAME
  });

  try {
    const [rows] = await pool.query(
      "SELECT id, username, password_hash FROM users WHERE username IN (?, ?, ?, ?)",
      ["rafael", "marina", "diego", "admin"]
    );

    let updated = 0;

    for (const row of rows) {
      const username = String(row.username || "").toLowerCase();
      const rawPassword = PASSWORD_BY_USERNAME[username];

      if (!rawPassword) continue;
      if (isBcryptHash(row.password_hash)) continue;

      const hash = await bcrypt.hash(rawPassword, 10);
      await pool.query("UPDATE users SET password_hash = ?, updated_at = NOW() WHERE id = ?", [
        hash,
        row.id
      ]);
      updated += 1;
      console.log(`Senha convertida para hash: ${username}`);
    }

    console.log(`Concluido. Usuarios atualizados: ${updated}`);
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error("Falha ao gerar hashes:", error.message);
  process.exit(1);
});
