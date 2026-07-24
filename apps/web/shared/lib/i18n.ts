import en from "../../messages/en.json";
import es from "../../messages/es.json";

export type Locale = "es" | "en";
export type Messages = typeof es;

const catalogs: Record<Locale, Messages> = {
  es,
  en,
};

export function resolveLocale(value: string | undefined | null): Locale {
  if (value === "en" || value === "es") {
    return value;
  }
  const fallback = process.env.NEXT_PUBLIC_DEFAULT_LOCALE;
  return fallback === "en" ? "en" : "es";
}

export function getMessages(locale: Locale): Messages {
  return catalogs[locale];
}
