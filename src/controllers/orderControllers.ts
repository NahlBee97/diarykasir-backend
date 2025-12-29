import { Request, Response, NextFunction } from "express";
import { OrderService } from "../services/orderServices";
import { NewOrder } from "../interfaces/orderInterface";

export const orderController = {
  createOrder: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orderData: NewOrder = {
        userId: req.body.userId,
        totalAmount: req.body.totalAmount,
        paymentCash: req.body.paymentCash,
        paymentChange: req.body.paymentChange,
      };
      
      const newOrder = await OrderService.createOrder(orderData);

      res
        .status(201)
        .json({ message: "Order created successfully", order: newOrder });
    } catch (error) {
      next(error);
    }
  },

  getOrderItemsByOrderId: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const orderId = req.params.orderId as string;

      const orderItems = await OrderService.getOrderItemsByOrderId(
        Number(orderId)
      );

      res
        .status(200)
        .json({ message: "Order items retrives successfully", orderItems });
    } catch (error) {
      next(error);
    }
  },

  getAllOrders: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { start, end, page, userId } = req.query;

      const ordersData = await OrderService.getAllOrders(
        start as string,
        end as string,
        Number(page),
        userId ? Number(userId) : undefined
      );

      res
        .status(200)
        .json({ message: "Get all orders data successfully", ordersData });
    } catch (error) {
      next(error);
    }
  },

  getTodayOrders: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.params.userId as string;
      const orders = await OrderService.getTodayOrders(Number(userId));

      res
        .status(200)
        .json({ message: "Get today orders successfully", orders });
    } catch (error) {
      next(error);
    }
  },

  getOrderSummary: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { start, end, userId } = req.query;
      const summary = await OrderService.getOrderSummary(
        start as string,
        end as string,
        userId ? Number(userId) : undefined
      );

      res
        .status(200)
        .json({ message: "Get order summary successfully", summary });
    } catch (error) {
      next(error);
    }
  },
};
