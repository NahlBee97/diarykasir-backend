import { Cart, CartItem } from "../interfaces/cartInterface";
import { NewOrder } from "../interfaces/orderInterface";
import { prisma } from "../lib/prisma";
import { AppError } from "../utils/appError";
import { getWitaDateRange } from "../helper/getWitaDateRange";

export const orderModel = {
  getAllOrders: async (
    startDate: Date,
    endDate: Date,
    skip: number,
    take: number,
    userId?: number
  ) => {
    try {
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
        take,
        skip,
      });
      return orders;
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

  create: async (orderData: NewOrder, cart: Cart) => {
    try {
      return await prisma.$transaction(async (tx) => {
        // 1. Create order
        const order = await tx.orders.create({
          data: {
            userId: orderData.userId,
            totalAmount: orderData.totalAmount,
            paymentCash: orderData.paymentCash,
            paymentChange: orderData.paymentChange,
          },
        });

        if (cart.items?.length === 0) {
          throw new AppError("Cart is empty", 400);
        }

        // 2. Create order items
        const orderItems = cart.items?.map((item: CartItem) => ({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.product?.price ?? 0,
        }));

        await tx.orderItems.createMany({
          data: orderItems ?? [],
        });

        // 3. Update product stock levels
        for (const item of cart.items ?? []) {
          const updatedProduct = await tx.products.update({
            where: { id: item.productId },
            data: {
              sale: {
                increment: item.quantity,
              },
              stock: {
                decrement: item.quantity,
              },
            },
            select: { stock: true }, // Return stock to verify
          });

          // Double-check stock didn't go negative
          if (updatedProduct.stock < 0) {
            throw new AppError(
              `Insufficient stock for product ${item.productId}`,
              400
            );
          }
        }

        // 4. Clear the user's cart
        await tx.cartItems.deleteMany({
          where: { cartId: cart.id },
        });

        return { order, orderItems: cart.items };
      });
    } catch (error) {
      throw error;
    }
  },

  getOrderItemsByOrderId: async (orderId: number) => {
    try {
      const orderItems = await prisma.orderItems.findMany({
        where: { orderId: orderId },
        include: { product: true },
      });
      return orderItems;
    } catch (error) {
      throw error;
    }
  },

  getOrderCount: async (startDate: Date, endDate: Date, userId?: number) => {
    try {
      const totalCount = await prisma.orders.count({
        where: {
          userId,
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      });
      return totalCount;
    } catch (error) {
      throw error;
    }
  },

  getSummary: async (startDate: Date, endDate: Date, userId?: number) => {
    try {
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
};
