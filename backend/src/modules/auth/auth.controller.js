import { authService } from "./auth.service.js";

async function login(req, res) {
  const result = authService.login(req.body.username, req.body.password);
  res.status(200).json(result);
}

export const authController = { login };
