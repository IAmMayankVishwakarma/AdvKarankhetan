"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import styles from "./Booking.module.css";

function money(minorUnits, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
  }).format(minorUnits / 100);
}

async function openRazorpay(payment, booking, onVerified, onError) {
  if (!window.Razorpay) {
    await new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  }
  return new Promise((resolve) => {
    let settled = false;
    const finish = (callback, value) => {
      if (settled) return;
      settled = true;
      callback?.(value);
      resolve();
    };
    const checkout = new window.Razorpay({
      key: payment.keyId,
      amount: payment.amountMinorUnits,
      currency: payment.currency,
      order_id: payment.orderId,
      name: "Karan Khetan",
      description: `Appointment: ${booking.service.name}`,
      handler: async (result) => {
        try {
          const response = await fetch("/api/payments/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(result),
          });
          const data = await response.json();
          if (!response.ok) throw new Error(data.error || "Payment verification failed.");
          finish(onVerified);
        } catch (error) {
          finish(onError, error.message);
        }
      },
      modal: {
        ondismiss: () => finish(onError, "Payment was not completed."),
      },
    });
    checkout.on("payment.failed", (event) => {
      finish(onError, event.error?.description || "Payment failed.");
    });
    checkout.open();
  });
}

export default function BookingFlow() {
  const [options, setOptions] = useState(null);
  const [serviceId, setServiceId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/bookings/options", { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Could not load booking options.");
        if (active) {
          setOptions(data);
          setServiceId(data.services[0]?.id ?? "");
          setDate(data.days.find((day) => day.available)?.date ?? "");
        }
      })
      .catch((loadError) => {
        if (active) setError(loadError.message);
      });
    return () => {
      active = false;
    };
  }, []);

  const service = options?.services.find((item) => item.id === serviceId);
  const selectedDay = options?.days.find((day) => day.date === date);
  const selectedPrice = options?.hasFreeAppointment ? 0 : service?.priceMinorUnits ?? 0;

  async function handleSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const intent = `booking:${serviceId}:${date}:${time}`;
      let idempotencyKey = sessionStorage.getItem(intent);
      if (!idempotencyKey) {
        idempotencyKey = crypto.randomUUID();
        sessionStorage.setItem(intent, idempotencyKey);
      }
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": idempotencyKey,
        },
        body: JSON.stringify({ serviceId, date, time }),
      });
      const data = await response.json();
      if (!response.ok) {
        if ([400, 404, 409, 502, 503].includes(response.status)) {
          sessionStorage.removeItem(intent);
        }
        throw new Error(data.error || "Could not create appointment.");
      }

      if (data.booking.isFreeAppointment) {
        setNotice("Your first appointment is confirmed and free.");
      } else if (data.payment?.orderId && data.payment?.keyId) {
        setNotice("Complete payment in the secure Razorpay window to confirm your appointment.");
        await openRazorpay(
          data.payment,
          data.booking,
          () => setNotice("Payment verified. Your appointment is confirmed."),
          (message) => setError(message),
        );
      } else {
        setNotice("Appointment is awaiting payment. It is not confirmed yet.");
      }
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.card} aria-labelledby="booking-title">
        <p className={styles.eyebrow}>PRIVATE CONSULTATION</p>
        <h1 id="booking-title">Book an appointment</h1>
        <p>Choose a service and an available time. All times use {options?.timeZone ?? "the business timezone"}.</p>

        {error && <p className={styles.error} role="alert">{error}</p>}
        {notice && <p className={styles.notice} role="status">{notice}</p>}

        {!options ? (
          <p aria-live="polite">Loading available appointments…</p>
        ) : options.services.length === 0 ? (
          <p>Appointments are not available yet. Please check back later.</p>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit}>
            <label>
              Service
              <select value={serviceId} onChange={(event) => setServiceId(event.target.value)} required>
                {options.services.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} — {options.hasFreeAppointment ? "First appointment free" : money(item.priceMinorUnits, item.currency)}
                  </option>
                ))}
              </select>
            </label>
            {service?.description && <p className={styles.description}>{service.description}</p>}
            <label>
              Date
              <select value={date} onChange={(event) => setDate(event.target.value)} required>
                {options.days.map((day) => (
                  <option disabled={!day.available} key={day.date} value={day.date}>
                    {day.date}{day.holiday ? ` — ${day.holiday}` : !day.available ? " — Unavailable" : ` — ${day.opensAt}–${day.closesAt}`}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Start time
              <input
                type="time"
                step="1800"
                min={selectedDay?.opensAt}
                max={selectedDay?.closesAt}
                value={time}
                onChange={(event) => setTime(event.target.value)}
                required
              />
            </label>
            <div className={styles.price}>
              <span>{options.hasFreeAppointment ? "First appointment" : "Amount due"}</span>
              <strong>{options.hasFreeAppointment ? "Free" : money(selectedPrice, service?.currency)}</strong>
            </div>
            <p className={styles.terms}>
              {options.hasFreeAppointment
                ? "One free appointment is available per account. Cancelling does not restore free eligibility."
                : "Your appointment is confirmed only after Razorpay payment is verified. Pending or failed payments do not confirm a booking."}
            </p>
            <button disabled={busy || !serviceId || !date || !time || !selectedDay?.available} type="submit">
              {busy ? "Processing…" : options.hasFreeAppointment ? "Confirm free appointment" : "Continue to secure payment"}
            </button>
          </form>
        )}
        <Link className={styles.accountLink} href="/account">View my appointments</Link>
      </section>
    </main>
  );
}
