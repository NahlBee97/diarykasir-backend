import { Router } from "express";
import { RoleGuard, VerifyToken } from "../middlewares/authMiddlewares";
import { orderController } from "../controllers/orderControllers";

const router = Router();

router.get("/", VerifyToken, RoleGuard, orderController.getAllOrders);
router.get("/today", VerifyToken, RoleGuard, orderController.getTodayOrders);
router.get("/today/:userId", VerifyToken, RoleGuard, orderController.getTodayOrders);
router.get("/summary", VerifyToken, RoleGuard, orderController.getOrderSummary);
router.get(
  "/order-items/:orderId",
  VerifyToken,
  RoleGuard,
  orderController.getOrderItemsByOrderId
);

router.post("/", VerifyToken, orderController.createOrder);

export default router;
