import { z } from "zod";

export const Settings = z.object({
  locale: z.enum(["es", "en"]),
  theme: z.enum(["light", "dark"]),
});

export type Settings = z.infer<typeof Settings>;

export const DEFAULT_SETTINGS: Settings = {
  locale: "es",
  theme: "light",
};
