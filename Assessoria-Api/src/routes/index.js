import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.routes.js";
import { assessmentRoutes } from "../modules/assessments/assessment.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/assessments", assessmentRoutes);

export { router };
