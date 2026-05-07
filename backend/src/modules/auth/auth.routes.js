import { Router } from "express";
import { authController } from "./auth.controller.js";
import { loginSchema } from "./auth.schema.js";
import { validate } from "../../middlewares/validate.middleware.js";

const authRoutes = Router();

authRoutes.post("/login", validate(loginSchema), authController.login);

export { authRoutes };
