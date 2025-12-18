import { Request, Response, NextFunction } from "express";
import { OrderService } from "../services/orderServices";

export const orderController = {
  createOrder: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newOrder = await OrderService.createOrder(req.body);

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
      const { start, end, page } = req.query;

      const ordersData = await OrderService.getAllOrders(start as string, end as string, Number(page));

      res.status(200).json({ message: "Get all orders data successfully", ordersData });
    } catch (error) {
      next(error);
    }
  },

  getTodayOrders: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orders = await OrderService.getTodayOrders();

      res
        .status(200)
        .json({ message: "Get today orders successfully", orders });
    } catch (error) {
      next(error);
    }
  },

  getOrderSummary: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {start, end} = req.query;
      const summary = await OrderService.getOrderSummary(start as string, end as string);

      res
        .status(200)
        .json({ message: "Get order summary successfully", summary });
    } catch (error) {
      next(error);
    }
  },
};
