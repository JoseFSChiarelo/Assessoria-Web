import { authService } from "./auth.service.js";

async function login(req, res, next) {
  try {
    const result = await authService.login(req.body.username, req.body.password);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export const authController = { login };
