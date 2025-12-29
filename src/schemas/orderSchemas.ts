import { z } from "zod";

export const createOrderSchema = z.object({
  body: z.object({
    userId: z.number().min(1, "User ID is required"),
    totalAmount: z.number().min(1, "Total amount is required"),
    paymentCash: z.number().min(0, "Payment cash is required"),
    paymentChange: z.number().min(0, "Payment change is required"),
  }),
});

export const getAllOrdersSchema = z.object({
  query: z.object({
    start: z.string(),
    end: z.string(),
    page: z
      .string()
        .regex(/^\d+$/, "Page must be a positive integer")
        .transform((val) => parseInt(val, 10)),
    userId: z
      .string()
      .regex(/^\d+$/, "User ID must be a positive integer")
        .transform((val) => parseInt(val, 10))
        .optional(),
  }),
});

export const getOrderItemsByOrderIdSchema = z.object({
  params: z.object({
    orderId: z
        .string()
        .regex(/^\d+$/, "Order ID must be a positive integer")
        .transform((val) => parseInt(val, 10)),
    }),
});

export const getOrderSummarySchema = z.object({
    query: z.object({
        start: z.string().optional(),
        end: z.string().optional(),
        userId: z
        .string()
        .regex(/^\d+$/, "User ID must be a positive integer")
        .transform((val) => parseInt(val, 10))
        .optional(),
    }),
});

