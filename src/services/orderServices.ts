import {
  createOrderTransaction,
  validateCartItems,
} from "../helper/orderHelpers";
import { CartItem } from "../interfaces/cartInterface";
import { NewOrder } from "../interfaces/orderInterface";
import { prisma } from "../lib/prisma";
import { AppError } from "../utils/appError";
import { cartService } from "./cartServices";

export const OrderService = {
  createOrder: async (orderData: NewOrder) => {
    try {
      const cart = await cartService.getUserCart(orderData.userId);

      if (!cart?.items?.length) {
        throw new AppError("Cart is empty", 400);
      }

      await validateCartItems(cart.items as CartItem[]);

      // Step 4: Create order in transaction
      const newOrder = await createOrderTransaction(orderData, cart);

      return newOrder;
    } catch (error) {
      throw error;
    }
  },

  getOrderItemsByOrderId: async (orderId: number) => {
    try {
      const orderItems = await prisma.orderItems.findMany({
        where: {
          orderId,
        },
        include: {
          product: true,
        },
      });

      if (orderItems.length === 0)
        throw new AppError("order items not found", 404);

      return orderItems;
    } catch (error) {
      throw error;
    }
  },

  getAllOrders: async () => {
    try {
      const orders = await prisma.orders.findMany({
        include: {
          user: true,
          items: {
            include: { product: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      return orders;
    } catch (error) {
      throw error;
    }
  },

  getOrderSummary: async () => {
    try {
      const ordersData = await prisma.orders.aggregate({
        _sum: {
          totalAmount: true,
        },
      });

      const totalRevenue = Number(ordersData._sum.totalAmount);

      const salesData = await prisma.orders.aggregate({
        _count: {
          id: true,
        },
      });

      const totalSales = salesData ? salesData._count.id : 0;

      const productData = await prisma.products.aggregate({
        _sum: {
          sale: true,
        },
      });

      const itemsSold = productData ? productData._sum.sale : 0;
      const averageSaleValue = totalRevenue/totalSales

      const summary = {
        totalRevenue,
        totalSales,
        averageSaleValue,
        itemsSold,
      }

      return summary;
    } catch (error) {
      throw error;
    }
  },

  getTodayOrders: async () => {
    try {
      const orders = await prisma.orders.findMany({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
        include: { user: true, items: { include: { product: true } } },
        orderBy: { createdAt: "desc" },
      });

      return orders;
    } catch (error) {
      throw error;
    }
  },
};
