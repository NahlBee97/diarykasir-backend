import { z } from "zod";

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    pin: z.string().min(1, "PIN is required"),
    shift: z.string().min(1, "Shift is required"),
  }),
});

export const updateUserSchema = z.object({
  params: z.object({
    id: z
      .string()
      .regex(/^\d+$/, "User ID must be a positive integer")
      .transform((val) => parseInt(val, 10)),
  }),
  body: z
    .object({
      name: z.string().min(1, "Name is required").optional(),
      pin: z.string().min(1, "PIN is required").optional(),
      shift: z.string().min(1, "Shift is required").optional(),
    })
    .partial(),
});

export const findUserByIdSchema = z.object({
  params: z.object({
    id: z
      .string()
      .regex(/^\d+$/, "User ID must be a positive integer")
      .transform((val) => parseInt(val, 10)),
  }),
});

export const deleteUserSchema = z.object({
  params: z.object({
    id: z
      .string()
      .regex(/^\d+$/, "User ID must be a positive integer")
      .transform((val) => parseInt(val, 10)),
  }),
});

export type CreateUserInput = z.infer<typeof createUserSchema>["body"];
export type UpdateUserInput = z.infer<typeof updateUserSchema>["body"];
