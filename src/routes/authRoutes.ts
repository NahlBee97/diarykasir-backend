import { Router } from "express";
import { AuthController } from "../controllers/authController";
import { VerifyToken } from "../middlewares/authMiddlewares";

const router = Router();

router.post("/login", AuthController.login);
router.post("/logout", VerifyToken, AuthController.logout);

export default router;