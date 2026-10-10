"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

const CONSENT_KEY = "bciDisclaimerAccepted";

export default function DisclaimerPopup() {
  const t = useTranslations("disclaimer");
  const [isOpen, setIsOpen] = useState(true);
  const [storageError, setStorageError] = useState("");
  const dialogRef = useRef(null);
  const agreeButtonRef = useRef(null);

  useEffect(() => {
    const checkConsent = window.setTimeout(() => {
      try {
        if (window.localStorage.getItem(CONSENT_KEY) === "true") {
          setIsOpen(false);
        }
      } catch (error) {
        console.error(
          "Unable to read disclaimer consent from localStorage.",
          error,
        );
        setStorageError(t("readError"));
      }
    }, 0);

    return () => window.clearTimeout(checkConsent);
  }, [t]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const siteContent = document.getElementById("site-content");
    const wasInert = siteContent?.inert ?? false;
    const previousOverflow = document.body.style.overflow;

    if (siteContent) {
      siteContent.inert = true;
    }
    document.body.style.overflow = "hidden";
    agreeButtonRef.current?.focus();

    function trapFocus(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const buttons = dialogRef.current?.querySelectorAll("button:not(:disabled)");
      if (!buttons?.length) {
        event.preventDefault();
        return;
      }

      const firstButton = buttons[0];
      const lastButton = buttons[buttons.length - 1];

      if (event.shiftKey && document.activeElement === firstButton) {
        event.preventDefault();
        lastButton.focus();
      } else if (!event.shiftKey && document.activeElement === lastButton) {
        event.preventDefault();
        firstButton.focus();
      }
    }

    document.addEventListener("keydown", trapFocus);

    return () => {
      if (siteContent) {
        siteContent.inert = wasInert;
      }
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", trapFocus);
    };
  }, [isOpen]);

  function handleAgree() {
    try {
      window.localStorage.setItem(CONSENT_KEY, "true");
      setStorageError("");
      setIsOpen(false);
    } catch (error) {
      console.error("Unable to save disclaimer consent to localStorage.", error);
      setStorageError(t("saveError"));
    }
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div className="disclaimer-overlay">
      <section
        aria-labelledby="disclaimer-title"
        aria-modal="true"
        className="disclaimer-dialog"
        ref={dialogRef}
        role="dialog"
      >
        <span className="lab">{t("eyebrow")}</span>
        <h2 id="disclaimer-title">{t("title")}</h2>
        <ul className="disclaimer-points">
          {t.raw("points").map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
        {storageError && (
          <p className="disclaimer-error" role="alert">
            {storageError}
          </p>
        )}
        <div className="disclaimer-actions">
          <button
            className="btn line"
            onClick={() => window.location.assign("https://www.google.com")}
            type="button"
          >
            {t("disagree")}
          </button>
          <button
            className="btn"
            onClick={handleAgree}
            ref={agreeButtonRef}
            type="button"
          >
            {t("agree")}
          </button>
        </div>
      </section>
    </div>
  );
}
