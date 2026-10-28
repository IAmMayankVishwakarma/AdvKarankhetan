"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import styles from "./AuthForm.module.css";

const initialVisibility = {
  password: false,
  confirmPassword: false,
};

export default function AuthForm({ mode }) {
  const t = useTranslations("auth");
  const locale = useLocale();
  const isSignup = mode === "signup";
  const [visibility, setVisibility] = useState(initialVisibility);
  const [formError, setFormError] = useState("");
  const [formNotice, setFormNotice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");
    setFormNotice("");

    const form = event.currentTarget;
    const password = form.querySelector("#password").value;
    const email = form.querySelector("#email").value;

    if (isSignup) {
      if (!/(?=.*[A-Za-z])(?=.*\d).{8,}/.test(password)) {
        setFormError(t("weakPassword"));
        return;
      }

      if (password !== form.querySelector("#confirmPassword").value) {
        setFormError(t("passwordMismatch"));
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/auth/${isSignup ? "signup" : "login"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: isSignup ? form.querySelector("#fullName").value : undefined,
          email,
          password,
        }),
      });

      if (!response.ok) {
        setFormError(
          response.status === 409
            ? t("emailTaken")
            : response.status === 401
              ? t("invalidCredentials")
              : t("requestError"),
        );
        return;
      }

      const query = new URLSearchParams(window.location.search);
      const requestedPath = query.get("returnTo");
      const destination =
        requestedPath?.startsWith(`/${locale}/`) &&
        !requestedPath.startsWith(`//`)
          ? requestedPath
          : `/${locale}/account`;
      window.location.assign(destination);
    } catch {
      setFormError(t("requestError"));
    } finally {
      setIsSubmitting(false);
    }
  }

  function clearFeedback() {
    setFormError("");
    setFormNotice("");
  }

  function toggleVisibility(field) {
    setVisibility((current) => ({ ...current, [field]: !current[field] }));
  }

  const passwordControl = (field, label, autoComplete) => (
    <div className={styles.field}>
      <label htmlFor={field}>{label}</label>
      <div className={styles.passwordControl}>
        <input
          autoComplete={autoComplete}
          id={field}
          minLength={isSignup ? 8 : undefined}
          onChange={clearFeedback}
          required
          type={visibility[field] ? "text" : "password"}
        />
        <button
          aria-label={visibility[field] ? t("hidePassword") : t("showPassword")}
          aria-pressed={visibility[field]}
          className={styles.visibilityToggle}
          onClick={() => toggleVisibility(field)}
          type="button"
        >
          {visibility[field] ? t("hidePassword") : t("showPassword")}
        </button>
      </div>
      {isSignup && field === "password" && (
        <small className={styles.hint}>{t("passwordHint")}</small>
      )}
    </div>
  );

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <aside className={styles.brandPanel}>
          <Image
            alt=""
            className={styles.logo}
            height={52}
            src="/karansirlogo.png"
            width={52}
          />
          <span className={styles.eyebrow}>{t("brandEyebrow")}</span>
          <p className={styles.brandMessage}>{t("brandMessage")}</p>
          <p className={styles.brandNote}>{t("brandNote")}</p>
        </aside>

        <section aria-labelledby="auth-title" className={styles.formPanel}>
          <span className={styles.eyebrow}>
            {isSignup ? t("signupEyebrow") : t("loginEyebrow")}
          </span>
          <h1 id="auth-title">
            {isSignup ? t("signupTitle") : t("loginTitle")}
          </h1>
          <p className={styles.intro}>
            {isSignup ? t("signupDescription") : t("loginDescription")}
          </p>

          <form
            action="#"
            className={styles.form}
            method="post"
            onSubmit={handleSubmit}
          >
            {isSignup && (
              <div className={styles.field}>
                <label htmlFor="fullName">{t("fullName")}</label>
                <input
                  autoComplete="name"
                  id="fullName"
                  maxLength={100}
                  onChange={clearFeedback}
                  required
                  type="text"
                />
              </div>
            )}

            <div className={styles.field}>
              <label htmlFor="email">{t("email")}</label>
              <input
                autoComplete="email"
                id="email"
                maxLength={254}
                onChange={clearFeedback}
                required
                type="email"
              />
            </div>

            {passwordControl(
              "password",
              t("password"),
              isSignup ? "new-password" : "current-password",
            )}

            {isSignup &&
              passwordControl(
                "confirmPassword",
                t("confirmPassword"),
                "new-password",
              )}

            {!isSignup && (
              <div className={styles.formOptions}>
                <label className={styles.remember}>
                  <input type="checkbox" />
                  <span>{t("rememberMe")}</span>
                </label>
                <Link href="/contact">{t("forgotPassword")}</Link>
              </div>
            )}

            {formError && (
              <p className={styles.error} role="alert">
                {formError}
              </p>
            )}
            {formNotice && (
              <p className={styles.notice} role="status">
                {formNotice}
              </p>
            )}

            <button
              className={styles.submitButton}
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting
                ? t("submitting")
                : isSignup
                  ? t("createAccount")
                  : t("login")}
            </button>
          </form>

          <p className={styles.switchPrompt}>
            {isSignup ? t("existingAccount") : t("newAccount")}{" "}
            <Link href={isSignup ? "/login" : "/signup"}>
              {isSignup ? t("loginLink") : t("signupLink")}
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
