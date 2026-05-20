import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";
import { ApiError } from "../../utils/api-error.js";
import bcrypt from "bcryptjs";
import { pool } from "../../config/database.js";

async function login(username, password) {
  const normalizedUsername = String(username || "").trim().toLowerCase();
  const [rows] = await pool.query(
    `SELECT id, username, name, email, role, password_hash
     FROM users
     WHERE LOWER(username) = ?
     LIMIT 1`,
    [normalizedUsername]
  );

  if (rows.length === 0) {
    throw new ApiError(401, "Credenciais invalidas");
  }

  const user = rows[0];
  const isValidPassword = await bcrypt.compare(String(password || ""), user.password_hash);

  if (!isValidPassword) {
    throw new ApiError(401, "Credenciais invalidas");
  }

  const token = jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    },
    env.JWT_SECRET,
    {
      expiresIn: "12h"
    }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  };
}

export const authService = { login };
