import { z } from "zod";

export const signupSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  resetQuestion: z.string().min(1, "Please select a security question"),
  resetAnswer: z
    .string()
    .min(2, "Please provide an answer to the security question"),
});

export type SignupFormData = z.infer<typeof signupSchema>;
