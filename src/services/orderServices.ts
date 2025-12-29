import { getWitaDateRange } from "../helper/getWitaDateRange";
import { validateCartItems } from "../helper/orderHelpers";
import { CartItem } from "../interfaces/cartInterface";
import { NewOrder } from "../interfaces/orderInterface";
import { orderModel } from "../models/orderModels";
import { AppError } from "../utils/appError";
import { cartService } from "./cartServices";

export const OrderService = {
  createOrder: async (orderData: NewOrder) => {
    try {
      const cart = await cartService.getUserCart(orderData.userId);

      if (!cart?.items?.length) {
        throw new AppError("Keranjang kosong", 400);
      }

      await validateCartItems(cart.items as CartItem[]);

      const newOrder = await orderModel.create(orderData, cart);

      if (!newOrder) {
        throw new AppError("Gagal membuat pesanan", 500);
      }

      return newOrder;
    } catch (error) {
      throw error;
    }
  },

  getOrderItemsByOrderId: async (orderId: number) => {
    try {
      const orderItems = await orderModel.getOrderItemsByOrderId(orderId);

      return orderItems;
    } catch (error) {
      throw error;
    }
  },

  getAllOrders: async (
    start: string,
    end: string,
    page: number = 1,
    userId?: number
  ) => {
    try {
      const skip = (page - 1) * 10;

      // Kita convert input string user menjadi Range WITA yang valid
      const startDate = getWitaDateRange(start).start;
      const endDate = getWitaDateRange(end).end;

      const orders = await orderModel.getAllOrders(
        startDate,
        endDate,
        skip,
        10,
        userId
      );

      const totalCount = await orderModel.getOrderCount(
        startDate,
        endDate,
        userId
      );

      return {
        orders: orders,
        totalOrders: totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / 10),
      };
    } catch (error) {
      throw error;
    }
  },

  getOrderSummary: async (start: string, end: string, userId?: number) => {
    try {
      const startDate = getWitaDateRange(start).start;
      const endDate = getWitaDateRange(end).end;

      const summaryData = await orderModel.getSummary(
        startDate,
        endDate,
        userId
      );

      return {
        totalRevenue: summaryData.totalRevenue,
        totalSales: summaryData.totalSales,
        averageSaleValue: Math.round(summaryData.averageSaleValue),
        itemsSold: summaryData.itemsSold,
      };
    } catch (error) {
      throw error;
    }
  },

  getTodayOrders: async (userId?: number) => {
    try {
      const orders = await orderModel.getTodayOrders(userId);
      return orders;
    } catch (error) {
      throw error;
    }
  },
};
