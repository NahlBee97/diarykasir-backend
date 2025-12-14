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

  // Update the function signature to accept a page number
  getAllOrders: async (start: string, end: string, page: number = 1) => {
    try {
      const TAKE = 10; // Number of items per page

      const startDate = new Date(start);
      const endDate = new Date(end);

      endDate.setHours(23, 59, 59, 999);

      // Calculate how many records to skip based on the page number
      const SKIP = (page - 1) * TAKE;

      // --- Query for the Paginated Orders ---
      const orders = await prisma.orders.findMany({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        include: {
          user: true,
          items: {
            include: { product: true },
          },
        },
        orderBy: { createdAt: "desc" },
        // **Pagination Options**
        take: TAKE, // Limit the number of records returned
        skip: SKIP, // Offset the records based on the page number
      });

      // --- Query for the Total Count ---
      // You need the total count to calculate the number of pages on the frontend
      const totalCount = await prisma.orders.count({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      });

      // Return both the data and the total count
      return {
        orders: orders,
        totalOrders: totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / TAKE),
      };
    } catch (error) {
      console.error("Error fetching paginated orders:", error);
      throw error;
    }
  },

  // Assuming your Prisma client is initialized and accessible as 'prisma'

  getOrderSummary: async (start: string, end: string) => {
    try {
      const startDate = new Date(start);
      const baseEndDate = new Date(end);

      // 1. Robustly set the end date to the last millisecond of the day
      baseEndDate.setHours(23, 59, 59, 999);
      const endDate = baseEndDate;

      // Date filter re-used for all queries
      const dateFilter = {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        status: "COMPLETED" as const, // OPTIONAL: Filter only COMPLETED orders for true revenue
      };

      // 2. COMBINED QUERY for Revenue and Sales Count (Orders table)
      const summaryData = await prisma.orders.aggregate({
        where: dateFilter,
        _sum: {
          totalAmount: true,
        },
        _count: {
          id: true, // Counts the number of orders (Total Sales)
        },
      });

      // 3. Separate Query for Total Items Sold (OrderItems table)
      // This is necessary because the item quantity is stored in the orderItems table.
      const itemsSoldData = await prisma.orderItems.aggregate({
        _sum: {
          quantity: true,
        },
        where: {
          // Link the item to the order's date range
          order: {
            ...dateFilter,
          },
        },
      });

      // --- Data Extraction & Calculation ---

      // Handle totalRevenue (convert from BigInt or Decimal to Number)
      const totalRevenue = Number(summaryData._sum.totalAmount || 0);

      // Extract total sales count
      const totalSales = summaryData._count.id || 0;

      // Extract total items sold
      // Note: Prisma returns BigInt for _sum of Int fields, so convert to Number.
      const itemsSold = Number(itemsSoldData._sum.quantity || 0);

      // 4. SAFELY CALCULATE Average Sale Value (Avoid division by zero)
      const averageSaleValue = totalSales > 0 ? totalRevenue / totalSales : 0;

      // 5. Final Summary Object
      const summary = {
        totalRevenue,
        totalSales,
        averageSaleValue: Math.round(averageSaleValue), // Round for currency display
        itemsSold,
      };

      return summary;
    } catch (error) {
      // Optional: Log the error for backend debugging
      console.error("Error calculating order summary:", error);
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
