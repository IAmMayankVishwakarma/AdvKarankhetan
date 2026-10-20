"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import styles from "./page.module.css";
import site from "@/Components/site.module.css";

const matterValues = [
  "Family dispute",
  "Commercial or business dispute",
  "Cross-border India–US dispute",
  "Landlord and tenant",
  "Consumer dispute",
  "Workplace or ombuds",
  "Other",
];

const valueRangeValues = [
  "Under ₹5 lakh",
  "₹5 to 50 lakh",
  "₹50 lakh to 5 crore",
  "Above ₹5 crore",
];

const urgencyValues = ["Within a week", "Within a month", "Not urgent"];

export default function ContactForm() {
  const t = useTranslations("contact");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [hasError, setHasError] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setFeedback("");
    setHasError(false);

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData.entries())),
      });

      if (!response.ok) {
        setHasError(true);
        setFeedback(t("sendError"));
        return;
      }

      form.reset();
      setFeedback(t("sendSuccess"));
    } catch {
      setHasError(true);
      setFeedback(t("sendError"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      className={`${site.card} ${styles.form}`}
      onSubmit={handleSubmit}
    >
      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input
          autoComplete="off"
          id="company"
          name="company"
          tabIndex={-1}
        />
      </div>
      <div className={styles.fieldRow}>
        <div>
          <label htmlFor="fn">{t("firstName")}</label>
          <input id="fn" name="first_name" maxLength={100} required />
        </div>
        <div>
          <label htmlFor="ln">{t("lastName")}</label>
          <input id="ln" name="last_name" maxLength={100} required />
        </div>
      </div>
      <label htmlFor="em">{t("emailAddress")}</label>
      <input id="em" name="email" type="email" maxLength={254} required />
      <label htmlFor="mt2">{t("matterPrompt")}</label>
      <select id="mt2" name="matter" required>
        {t.raw("matters").map((matter, index) => (
          <option key={matterValues[index]} value={matterValues[index]}>
            {matter}
          </option>
        ))}
      </select>
      <div className={styles.fieldRow}>
        <div>
          <label htmlFor="dv">{t("valuePrompt")}</label>
          <select id="dv" name="value">
            <option value="">{t("selectRange")}</option>
            {t.raw("valueRanges").map((range, index) => (
              <option key={valueRangeValues[index]} value={valueRangeValues[index]}>
                {range}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="ur">{t("urgencyPrompt")}</label>
          <select id="ur" name="urgency">
            <option value="">{t("selectUrgency")}</option>
            {t.raw("urgencies").map((urgency, index) => (
              <option key={urgencyValues[index]} value={urgencyValues[index]}>
                {urgency}
              </option>
            ))}
          </select>
        </div>
      </div>
      <label htmlFor="ms">{t("message")}</label>
      <textarea id="ms" name="message" rows="5" maxLength={5000} required />
      <p className={`${site.note} ${styles.confidentialMessage}`}>
        {t("confidentialMessage")}
      </p>
      {feedback && (
        <p className={hasError ? styles.formError : styles.formSuccess} role={hasError ? "alert" : "status"}>
          {feedback}
        </p>
      )}
      <div className={styles.formActions}>
        <button className={`${site.button} ${site.outlineButton}`} type="reset">
          {t("clear")}
        </button>
        <button className={site.button} disabled={isSubmitting} type="submit">
          {isSubmitting ? t("sending") : t("send")}
        </button>
      </div>
    </form>
  );
}
