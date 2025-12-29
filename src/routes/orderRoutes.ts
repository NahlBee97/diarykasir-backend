import { Router } from "express";
import { RoleGuard, VerifyToken } from "../middlewares/authMiddlewares";
import { orderController } from "../controllers/orderControllers";
import { validateRequest } from "../middlewares/validationMiddleware";
import { createOrderSchema, getAllOrdersSchema, getOrderItemsByOrderIdSchema, getOrderSummarySchema } from "../schemas/orderSchemas";

const router = Router();

router.get("/", VerifyToken, RoleGuard, validateRequest(getAllOrdersSchema), orderController.getAllOrders);
router.get("/today", VerifyToken, RoleGuard, orderController.getTodayOrders);
router.get("/today/:userId", VerifyToken, RoleGuard, orderController.getTodayOrders);
router.get("/summary", VerifyToken, RoleGuard, validateRequest(getOrderSummarySchema), orderController.getOrderSummary);
router.get(
  "/order-items/:orderId",
  VerifyToken,
  RoleGuard,
  validateRequest(getOrderItemsByOrderIdSchema),
  orderController.getOrderItemsByOrderId
);

router.post("/", VerifyToken, validateRequest(createOrderSchema), orderController.createOrder);

export default router;
