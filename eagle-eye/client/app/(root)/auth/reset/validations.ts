import { z } from "zod";

export const resetSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  resetQuestion: z.string().min(1, "Please select a security question"),
  resetAnswer: z
    .string()
    .min(2, "Please provide an answer to the security question"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
});

export type ResetFormData = z.infer<typeof resetSchema>;
