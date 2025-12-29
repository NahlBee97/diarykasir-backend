import { Router } from "express";
import { VerifyToken } from "../middlewares/authMiddlewares";
import { cartController } from "../controllers/cartControllers";
import { validateRequest } from "../middlewares/validationMiddleware";
import { addItemSchema, deleteItemSchema, updateItemSchema } from "../schemas/cartSchemas";

const router = Router();

router.get("/", VerifyToken, cartController.getUserCart);
router.post("/items", VerifyToken, validateRequest(addItemSchema), cartController.addItem);
router.put("/items/:itemId", VerifyToken, validateRequest(updateItemSchema), cartController.updateItem);
router.delete("/items/:itemId", VerifyToken, validateRequest(deleteItemSchema), cartController.deleteItem);

export default router;
