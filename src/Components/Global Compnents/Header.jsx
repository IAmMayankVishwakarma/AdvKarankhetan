"use client";

import { useEffect, useRef, useState } from "react";
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
  { href: "/contact", key: "contact" },
];

export default function Header() {
  const t = useTranslations("navigation");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const accountMenuRef = useRef(null);
  const languageMenuRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    let active = true;
    fetch("/api/auth/session", { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error("Could not check the session.");
        return response.json();
      })
      .then(({ user: sessionUser }) => {
        if (active) setUser(sessionUser);
      })
      .catch((error) => console.error("Failed to load header session:", error));

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    function closeMenus() {
      if (accountMenuRef.current) accountMenuRef.current.open = false;
      if (languageMenuRef.current) languageMenuRef.current.open = false;
    }

    function handlePointerDown(event) {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target)) {
        accountMenuRef.current.open = false;
      }
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target)) {
        languageMenuRef.current.open = false;
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        const openMenu = [accountMenuRef.current, languageMenuRef.current].find(
          (menu) => menu?.open,
        );
        closeMenus();
        openMenu?.querySelector("summary")?.focus();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (accountMenuRef.current) accountMenuRef.current.open = false;
    if (languageMenuRef.current) languageMenuRef.current.open = false;
  }, [pathname]);

  function closeNavigation() {
    setIsMenuOpen(false);
  }

  function closeAccountMenu() {
    if (accountMenuRef.current) accountMenuRef.current.open = false;
    closeNavigation();
  }

  function handleLanguageChange(language) {
    if (languageMenuRef.current) languageMenuRef.current.open = false;
    setIsMenuOpen(false);
    router.replace(pathname, { locale: language });
  }

  async function handleLogout() {
    const response = await fetch("/api/auth/logout", { method: "POST" });
    if (!response.ok) {
      console.error("Could not sign out.");
      return;
    }
    setUser(null);
    router.refresh();
  }

  return (
    <header>
      <nav aria-label="Main" className={styles.nav}>
        <Link className={styles.logo} href="/" onClick={closeNavigation}>
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
                onClick={closeNavigation}
              >
                {t(key)}
              </Link>
            </li>
          ))}
          {!user ? (
            <>
              <li>
                <Link href="/login" onClick={closeNavigation}>
                  {t("login")}
                </Link>
              </li>
              <li>
                <Link href="/signup" onClick={closeNavigation}>
                  {t("signup")}
                </Link>
              </li>
            </>
          ) : (
            <li className={styles.accountMenu}>
              <details ref={accountMenuRef}>
                <summary aria-label={`Account menu for ${user.name}`}>
                  <span className={styles.accountName}>{user.name}</span>
                </summary>
                <ul className={styles.accountOptions}>
                  <li>
                    <Link href="/account" onClick={closeAccountMenu}>
                      {t("myAppointments")}
                    </Link>
                  </li>
                  {user.role === "ADMIN" && (
                    <li>
                      <Link href="/admin" onClick={closeAccountMenu}>
                        {t("adminPanel")}
                      </Link>
                    </li>
                  )}
                  <li>
                    <button
                      onClick={() => {
                        closeAccountMenu();
                        handleLogout();
                      }}
                      type="button"
                    >
                      {t("logout")}
                    </button>
                  </li>
                </ul>
              </details>
            </li>
          )}
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
        <Link
          className={`${site.button} ${styles.consultationButton}`}
          href="/book"
          onClick={closeNavigation}
        >
          {t("consultation")}
        </Link>
      </nav>
    </header>
  );
}
