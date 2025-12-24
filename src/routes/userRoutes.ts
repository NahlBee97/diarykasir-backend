import { Router } from "express";
import { userController } from "../controllers/userController";
import { VerifyToken } from "../middlewares/authMiddlewares";

const router = Router();

router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.post("/", VerifyToken, userController.createUser);
router.put("/:id", VerifyToken, userController.updateUser);
router.delete("/:id", VerifyToken, userController.deleteUser);

export default router;