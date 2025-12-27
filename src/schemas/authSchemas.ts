import { z } from "zod";

export const LoginSchema = z.object({
  body: z.object({
    userId: z.number().min(1, "ID is required"),
    pin: z.string().min(1, "Pin is required"),
  }),
});
