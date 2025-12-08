import { Router } from "express";
import { VerifyToken } from "../middlewares/authMiddlewares";
import { orderController } from "../controllers/orderControllers";

const router = Router();

router.get("/", VerifyToken, orderController.getAllOrders);
router.get(
  "/order-items/:orderId",
  VerifyToken,
  orderController.getOrderItemsByOrderId
);
router.post("/", VerifyToken, orderController.createOrder);

export default router;
