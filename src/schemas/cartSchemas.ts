import { z } from "zod";

export const addItemSchema = z.object({
  body: z.object({
    productId: z.number().min(1, "ID is required"),
    quantity: z.number().min(1, "Quantity is required"),
  }),
});

export const updateItemSchema = z.object({
  params: z.object({
    itemId: z.string().min(1, "Item ID is required"),
    }),
    body: z.object({
        quantity: z.number().min(1, "Quantity is required"),
    }),
});

export const deleteItemSchema = z.object({
  params: z.object({
    itemId: z.string().min(1, "Item ID is required"),
  }),
});
