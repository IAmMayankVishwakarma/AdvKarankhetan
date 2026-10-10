import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "hi", "hi-Latn", "ja", "es"],
  defaultLocale: "en",
  localePrefix: "always",
  localeDetection: false,
});
