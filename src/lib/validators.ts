import { z } from "zod";

export const cartItemPayloadSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().min(1).max(99),
});

export const checkoutSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  phone: z
    .string()
    .regex(/^\+?[0-9\s\-()]{7,20}$/, "Enter a valid phone number."),
  address: z
    .string()
    .min(10, "Address must be at least 10 characters long.")
    .max(180, "Address is too long."),
  couponCode: z.string().trim().max(30).optional().or(z.literal("")),
  items: z.array(cartItemPayloadSchema).min(1, "Your cart is empty."),
});

export const orderSearchSchema = z
  .object({
    email: z.string().trim(),
    phone: z.string().trim(),
    orderId: z.string().trim(),
  })
  .superRefine((value, ctx) => {
    if (!value.orderId && !(value.email && value.phone)) {
      ctx.addIssue({
        code: "custom",
        message: "Search by order ID or by both email and phone number.",
      });
    }

    if (value.email && !z.string().email().safeParse(value.email).success) {
      ctx.addIssue({
        code: "custom",
        path: ["email"],
        message: "Enter a valid email address.",
      });
    }

    if (value.phone && !/^\+?[0-9\s\-()]{7,20}$/.test(value.phone)) {
      ctx.addIssue({
        code: "custom",
        path: ["phone"],
        message: "Enter a valid phone number.",
      });
    }
  });
