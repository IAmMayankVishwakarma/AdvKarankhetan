import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "hi", "ro", "es", "ja"],
  defaultLocale: "en",
  localePrefix: "always",
  localeDetection: false,
});
