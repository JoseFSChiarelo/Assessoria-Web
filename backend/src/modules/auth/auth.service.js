import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";
import { ApiError } from "../../utils/api-error.js";

const users = [
  {
    id: "user-rafael",
    name: "Rafael Costa",
    username: "rafael",
    email: "rafael@exens.com.br",
    password: "123456",
    role: "Tecnico"
  },
  {
    id: "user-marina",
    name: "Marina Souza",
    username: "marina",
    email: "marina@exens.com.br",
    password: "123456",
    role: "Tecnica"
  },
  {
    id: "user-diego",
    name: "Diego Ramos",
    username: "diego",
    email: "diego@exens.com.br",
    password: "123456",
    role: "Tecnico"
  },
  {
    id: "user-admin",
    name: "Equipe Assessoria",
    username: "admin",
    email: "admin@exens.com.br",
    password: "admin123",
    role: "Administrador"
  }
];

function login(username, password) {
  const normalizedUsername = String(username || "").trim().toLowerCase();
  const user = users.find((item) => item.username.toLowerCase() === normalizedUsername);

  if (!user || user.password !== password) {
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
