import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import {
  createAssessmentSchema,
  getByIdSchema,
  updateAssessmentSchema
} from "./assessment.schema.js";
import { assessmentController } from "./assessment.controller.js";

const assessmentRoutes = Router();

assessmentRoutes.use(authMiddleware);
assessmentRoutes.get("/", assessmentController.list);
assessmentRoutes.get("/:id", validate(getByIdSchema), assessmentController.getById);
assessmentRoutes.post("/", validate(createAssessmentSchema), assessmentController.create);
assessmentRoutes.put("/:id", validate(updateAssessmentSchema), assessmentController.update);
assessmentRoutes.delete("/:id", validate(getByIdSchema), assessmentController.remove);

export { assessmentRoutes };
