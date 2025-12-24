import { getWitaDateRange } from "../helper/getWitaDateRange";
import { createOrder, validateCartItems } from "../helper/orderHelpers";
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
      const newOrder = await createOrder(orderData, cart);

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

  getAllOrders: async (start: string, end: string, page: number = 1, userId?: number) => {
    try {
      const TAKE = 10;
      const SKIP = (page - 1) * TAKE;

      // Kita convert input string user menjadi Range WITA yang valid
      const startDate = getWitaDateRange(start).start;
      const endDate = getWitaDateRange(end).end;

      const orders = await prisma.orders.findMany({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
          ...(userId ? { userId: userId } : {}),
        },
        include: {
          user: true,
          items: {
            include: { product: true },
          },
        },
        orderBy: { createdAt: "desc" },
        take: TAKE,
        skip: SKIP,
      });

      const totalCount = await prisma.orders.count({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      });

      return {
        orders: orders,
        totalOrders: totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / TAKE),
      };
    } catch (error) {
      throw error;
    }
  },

  getOrderSummary: async (start: string, end: string, userId?: number) => {
    try {
      // --- PERBAIKAN TIMEZONE DI SINI ---
      const startDate = getWitaDateRange(start).start;
      const endDate = getWitaDateRange(end).end;

      const filter = {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        ...(userId ? { userId: userId } : {}),
        status: "COMPLETED" as const,
      };

      const summaryData = await prisma.orders.aggregate({
        where: filter,
        _sum: { totalAmount: true },
        _count: { id: true },
      });

      const itemsSoldData = await prisma.orderItems.aggregate({
        _sum: { quantity: true },
        where: {
          order: { ...filter },
        },
      });

      const totalRevenue = Number(summaryData._sum.totalAmount || 0);
      const totalSales = summaryData._count.id || 0;
      const itemsSold = Number(itemsSoldData._sum.quantity || 0);
      const averageSaleValue = totalSales > 0 ? totalRevenue / totalSales : 0;

      return {
        totalRevenue,
        totalSales,
        averageSaleValue: Math.round(averageSaleValue),
        itemsSold,
      };
    } catch (error) {
      throw error;
    }
  },

  getTodayOrders: async (userId?: number) => {
    try {
      const { start } = getWitaDateRange();

      const orders = await prisma.orders.findMany({
        where: {
          createdAt: {
            gte: start,
          },
          ...(userId ? { userId: userId } : {}),
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
