import { Router } from "express";
import { userController } from "../controllers/userController";
import { RoleGuard, VerifyToken } from "../middlewares/authMiddlewares";

const router = Router();

router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.post("/", VerifyToken, RoleGuard, userController.createUser);
router.put("/:id", VerifyToken, RoleGuard, userController.updateUser);
router.delete("/:id", VerifyToken, RoleGuard, userController.deleteUser);

export default router;