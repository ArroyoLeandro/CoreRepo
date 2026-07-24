import { z } from "zod";
import { User } from "./auth";

export const CreateUserBody = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
  role: z.enum(["admin", "user"]).default("user"),
});

export type CreateUserBody = z.infer<typeof CreateUserBody>;

export const UpdateUserBody = z
  .object({
    email: z.string().email().optional(),
    password: z.string().min(8).optional(),
    name: z.string().min(1).optional(),
    role: z.enum(["admin", "user"]).optional(),
  })
  .refine(
    (value) =>
      value.email !== undefined ||
      value.password !== undefined ||
      value.name !== undefined ||
      value.role !== undefined,
    { message: "At least one field is required" },
  );

export type UpdateUserBody = z.infer<typeof UpdateUserBody>;

export const UsersList = z.object({
  users: z.array(User),
});

export type UsersList = z.infer<typeof UsersList>;
