"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import site from "@/Components/site.module.css";
import styles from "./Header.module.css";

const languages = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "ro", label: "Română" },
  { code: "es", label: "Español" },
  { code: "ja", label: "日本語" },
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
  const languageMenuRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function handleLanguageChange(language) {
    languageMenuRef.current.open = false;
    setIsMenuOpen(false);
    router.replace(pathname, { locale: language });
  }

  return (
    <header>
      <nav aria-label="Main" className={styles.nav}>
        <Link className={styles.logo} href="/">
          <Image
            alt=""
            className={styles.logoMark}
            height={44}
            priority
            src="/karansirlogo.png"
            width={44}
          />
          {/* <span>
            Karan <i>Khetan</i>
          </span> */}
        </Link>
        <button
          aria-controls="main-navigation"
          aria-expanded={isMenuOpen}
          aria-label={t("menu")}
          className={styles.menuToggle}
          onClick={() => setIsMenuOpen((open) => !open)}
          type="button"
        >
          {isMenuOpen ? "×" : "☰"}
        </button>
        <ul
          className={`${styles.links} ${isMenuOpen ? styles.linksOpen : ""}`}
          id="main-navigation"
        >
          {navigation.map(({ href, key }) => (
            <li key={key}>
              <Link
                href={href}
                className={pathname === href ? styles.activeLink : undefined}
                aria-current={pathname === href ? "page" : undefined}
                onClick={() => setIsMenuOpen(false)}
              >
                {t(key)}
              </Link>
            </li>
          ))}
        </ul>
        <details className={styles.languageMenu} ref={languageMenuRef}>
          <summary aria-label={t("language")} className={styles.languageSummary}>
            {languages.find(({ code }) => code === locale)?.label}
          </summary>
          <ul className={styles.languageOptions}>
            {languages.map(({ code, label }) => (
              <li key={code}>
                <button
                  type="button"
                  aria-pressed={locale === code}
                  onClick={() => handleLanguageChange(code)}
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </details>
        <a
          className={`${site.button} ${styles.consultationButton}`}
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
