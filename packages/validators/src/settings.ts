import { z } from "zod";

export const Settings = z.object({
  locale: z.enum(["es", "en"]),
  theme: z.enum(["light", "dark"]),
});

export type Settings = z.infer<typeof Settings>;

export const UpdateSettingsBody = z
  .object({
    locale: z.enum(["es", "en"]).optional(),
    theme: z.enum(["light", "dark"]).optional(),
  })
  .refine(
    (value) => value.locale !== undefined || value.theme !== undefined,
    { message: "At least one of locale or theme is required" },
  );

export type UpdateSettingsBody = z.infer<typeof UpdateSettingsBody>;

export const DEFAULT_SETTINGS: Settings = {
  locale: "es",
  theme: "light",
};
