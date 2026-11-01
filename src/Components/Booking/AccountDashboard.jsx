"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import styles from "./Booking.module.css";

function formatDate(value, timeZone) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone,
  }).format(new Date(value));
}

export default function AccountDashboard({ user }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  async function load() {
    const response = await fetch("/api/bookings", { cache: "no-store" });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Could not load appointments.");
    setData(result);
  }

  useEffect(() => {
    let active = true;
    fetch("/api/bookings", { cache: "no-store" })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Could not load appointments.");
        return result;
      })
      .then((result) => {
        if (active) setData(result);
      })
      .catch((loadError) => {
        if (active) setError(loadError.message);
      });
    return () => {
      active = false;
    };
  }, []);

  async function cancel(id) {
    if (!window.confirm("Cancel this appointment? The free appointment will remain used, and completed payments are not automatically refunded.")) return;
    setError("");
    const response = await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "cancel" }),
    });
    const result = await response.json();
    if (!response.ok) {
      setError(result.error || "Could not cancel appointment.");
      return;
    }
    await load();
  }

  async function reschedule(event, id) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!window.confirm("Reschedule this appointment to the selected date and time?")) return;
    setError("");
    const response = await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "reschedule",
        date: form.elements.date.value,
        time: form.elements.time.value,
      }),
    });
    const result = await response.json();
    if (!response.ok) {
      setError(result.error || "Could not reschedule appointment.");
      return;
    }
    form.reset();
    await load();
  }

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <p className={styles.eyebrow}>MY ACCOUNT</p>
        <h1>My appointments</h1>
        <p>{user.name} · {user.email}</p>
        {data && (
          <p role="status">
            {data.hasFreeAppointment
              ? "Your first appointment is available free."
              : "Your free appointment has been used."}
          </p>
        )}
        {error && <p className={styles.error} role="alert">{error}</p>}
        <Link className={styles.accountLink} href="/book">Book an appointment</Link>
        {!data ? (
          <p aria-live="polite">Loading appointments…</p>
        ) : data.bookings.length === 0 ? (
          <p>You do not have any appointments yet.</p>
        ) : (
          <div className={styles.appointments}>
            {data.bookings.map((booking) => (
              <article className={styles.appointment} key={booking.id}>
                <h2>{booking.service.name}</h2>
                <p>{formatDate(booking.startsAt, booking.timeZone)}</p>
                <p>Status: {booking.status.replaceAll("_", " ")}</p>
                <p>
                  Payment: {booking.isFreeAppointment ? "Free first appointment" : booking.paymentStatus}
                  {!booking.isFreeAppointment && ` · ${(booking.amountMinorUnits / 100).toLocaleString("en-IN", { style: "currency", currency: booking.service.currency })}`}
                </p>
                {booking.payment?.providerPaymentId && (
                  <p>Payment reference: {booking.payment.providerPaymentId}</p>
                )}
                {["CONFIRMED", "PENDING_PAYMENT"].includes(booking.status) && (
                  <div className={styles.actions}>
                    <form onSubmit={(event) => reschedule(event, booking.id)}>
                      <label>
                        New date
                        <input name="date" type="date" required />
                      </label>
                      <label>
                        New time
                        <input name="time" type="time" step="1800" required />
                      </label>
                      <button type="submit">Reschedule</button>
                    </form>
                    <button onClick={() => cancel(booking.id)} type="button">Cancel appointment</button>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
