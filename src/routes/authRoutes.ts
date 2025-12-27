import { Router } from "express";
import { AuthController } from "../controllers/authController";
import { VerifyToken } from "../middlewares/authMiddlewares";
import { validateRequest } from "../middlewares/validationMiddleware";
import { LoginSchema } from "../schemas/authSchemas";

const router = Router();

router.post("/login", validateRequest(LoginSchema), AuthController.login);
router.post("/logout", VerifyToken, AuthController.logout);

export default router;