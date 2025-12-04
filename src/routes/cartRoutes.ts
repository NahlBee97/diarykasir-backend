import { Router } from "express";
import { VerifyToken } from "../middlewares/authMiddlewares";
import { cartController } from "../controllers/cartControllers";

const router = Router();

router.get(
  "/",
  VerifyToken,
  cartController.getUserCart
);
router.post(
  "/items",
  VerifyToken,
  cartController.addItem
);
router.put(
  "/items/:itemId",
  VerifyToken,
  cartController.updateItem
);
router.delete(
  "/items/:itemId",
  VerifyToken,
  cartController.deleteItem
);

export default router;
