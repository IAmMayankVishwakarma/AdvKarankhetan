"use client";

import { useEffect, useRef, useState } from "react";

const CONSENT_KEY = "bciDisclaimerAccepted";

export default function DisclaimerPopup() {
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
        setStorageError(
          "Your browser could not check saved consent. Please accept to continue; this preference may not be saved.",
        );
      }
    }, 0);

    return () => window.clearTimeout(checkConsent);
  }, []);

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
      setStorageError(
        "We could not save your preference. Please enable browser storage and try again.",
      );
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
        <span className="lab">Please read before continuing</span>
        <h2 id="disclaimer-title">DISCLAIMER &amp; INTENTION</h2>
        <ul className="disclaimer-points">
          <li>
            This website is provided solely for general informational purposes
            and does not constitute legal advice.
          </li>
          <li>
            Nothing on this website is intended to advertise or solicit legal
            work. Karan Khetan does not seek work through this website, in
            accordance with Rule 36 of the Bar Council of India Rules.
          </li>
          <li>
            Accessing, reading or using this website, or sending an enquiry,
            does not create a lawyer-client relationship.
          </li>
          <li>
            Do not act or rely on information here as a substitute for
            independent legal advice from a lawyer engaged for your matter.
          </li>
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
            DISAGREE
          </button>
          <button
            className="btn"
            onClick={handleAgree}
            ref={agreeButtonRef}
            type="button"
          >
            I AGREE
          </button>
        </div>
      </section>
    </div>
  );
}
