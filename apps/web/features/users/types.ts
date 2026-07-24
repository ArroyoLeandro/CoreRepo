import { createBrowserApi } from "@/shared/lib/api";

export type UserRow = Awaited<
  ReturnType<ReturnType<typeof createBrowserApi>["listUsers"]>
>["users"][number];
