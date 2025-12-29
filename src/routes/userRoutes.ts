import { Router } from "express";
import { userController } from "../controllers/userController";
import { RoleGuard, VerifyToken } from "../middlewares/authMiddlewares";
import { validateRequest } from "../middlewares/validationMiddleware";
import { createUserSchema, deleteUserSchema, findUserByIdSchema, updateUserSchema } from "../schemas/userSchemas";

const router = Router();

router.get("/", userController.getAllUsers);
router.get("/:id", VerifyToken, RoleGuard, validateRequest(findUserByIdSchema), userController.getUserById);
router.post("/", VerifyToken, RoleGuard, validateRequest(createUserSchema), userController.createUser);
router.put("/:id", VerifyToken, RoleGuard, validateRequest(updateUserSchema), userController.updateUser);
router.delete("/:id", VerifyToken, RoleGuard, validateRequest(deleteUserSchema), userController.deleteUser);

export default router;