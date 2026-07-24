import { z } from "zod";

export const RegisterBody = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
});

export type RegisterBody = z.infer<typeof RegisterBody>;

export const LoginBody = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type LoginBody = z.infer<typeof LoginBody>;

export const ForgotPasswordBody = z.object({
  email: z.string().email(),
});

export type ForgotPasswordBody = z.infer<typeof ForgotPasswordBody>;

export const ResetPasswordBody = z.object({
  token: z.string().min(1),
  password: z.string().min(8),
});

export type ResetPasswordBody = z.infer<typeof ResetPasswordBody>;

export const User = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(1),
  role: z.enum(["admin", "user"]),
});

export type User = z.infer<typeof User>;
