"use client";

import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";

const languages = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "hi-Latn", label: "Roman Hindi" },
  { code: "ja", label: "日本語" },
  { code: "es", label: "Español" },
];

const navigation = [
  { href: "/", key: "home" },
  { href: "/about", key: "about" },
  { href: "/services", key: "services" },
  { href: "/credentials", key: "credentials" },
  { href: "/pricing", key: "pricing" },
  { href: "/contact", key: "contact" },
];

export default function Header() {
  const t = useTranslations("navigation");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  function handleLanguageChange(event) {
    router.replace(pathname, { locale: event.target.value });
  }

  return (
    <header>
      <nav aria-label="Main">
        <Link className="logo" href="/">
          Karan <i>Khetan</i>
        </Link>
        <input type="checkbox" id="mt" />
        <label className="burger" htmlFor="mt" aria-label={t("menu")}>
          ☰
        </label>
        <ul>
          {navigation.map(({ href, key }) => (
            <li key={key}>
              <Link
                href={href}
                className={pathname === href ? "on" : undefined}
                aria-current={pathname === href ? "page" : undefined}
              >
                {t(key)}
              </Link>
            </li>
          ))}
        </ul>
        <select
          aria-label={t("language")}
          className="language-switcher"
          onChange={handleLanguageChange}
          value={locale}
        >
          {languages.map(({ code, label }) => (
            <option key={code} value={code}>
              {label}
            </option>
          ))}
        </select>
        <a
          className="btn"
          href="https://calendar.app.google/qPMYTsG7UpaxcGTi8"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t("consultation")}
        </a>
      </nav>
    </header>
  );
}
