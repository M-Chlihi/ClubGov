import { z } from "zod";

export const pollFormSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(3, "Title must contain at least 3 characters.")
      .max(200, "Title cannot exceed 200 characters."),

    description: z
      .string()
      .trim()
      .max(1000, "Description cannot exceed 1000 characters.")
      .optional()
      .or(z.literal("")),

    startsAt: z.string().min(1, "Start date and time are required."),

    endsAt: z.string().min(1, "End date and time are required."),

    options: z
      .array(
        z.object({
          title: z
            .string()
            .trim()
            .min(1, "Option title is required.")
            .max(150, "Option title is too long."),

          description: z
            .string()
            .trim()
            .max(500, "Option description is too long.")
            .optional()
            .or(z.literal("")),
        }),
      )
      .min(2, "A poll must contain at least 2 options."),
  })
  .superRefine((data, ctx) => {
    const start = new Date(data.startsAt);
    const end = new Date(data.endsAt);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return;
    }

    if (end <= start) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endsAt"],
        message: "End time must be after start time.",
      });
    }
  });

export const signupSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username must be at most 20 characters"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
