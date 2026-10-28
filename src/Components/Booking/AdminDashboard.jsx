"use client";

import { useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  CalendarDays,
  CalendarOff,
  ClipboardList,
  LayoutDashboard,
  Menu,
  Settings,
  X,
} from "lucide-react";
import styles from "./Booking.module.css";
import adminStyles from "./AdminDashboard.module.css";

const navigationGroups = [
  {
    label: "Workspace",
    items: [{ id: "overview", label: "Overview", icon: LayoutDashboard }],
  },
  {
    label: "Operations",
    items: [
      { id: "services", label: "Pricing plans / services", icon: BriefcaseBusiness },
      { id: "appointments", label: "Appointments", icon: ClipboardList },
    ],
  },
  {
    label: "Scheduling",
    items: [
      { id: "settings", label: "Business settings", icon: Settings },
      { id: "availability", label: "Date availability", icon: CalendarDays },
      { id: "holidays", label: "Holidays and closures", icon: CalendarOff },
    ],
  },
];

const initialSettings = {
  timeZone: "Asia/Kolkata",
  defaultMaxMeetings: 4,
  defaultOpenTime: "09:00",
  defaultCloseTime: "17:00",
  cancellationHours: 24,
  allowReschedule: true,
};

async function request(url, init) {
  const response = await fetch(url, init);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Request failed.");
  return data;
}

function dateText(value, timeZone = "Asia/Kolkata") {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone,
  }).format(new Date(value));
}

export default function AdminDashboard() {
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [settings, setSettings] = useState(initialSettings);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [busy, setBusy] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  async function refresh() {
    const [serviceData, bookingData, holidayData, settingsData] = await Promise.all([
      request("/api/admin/services"),
      request("/api/admin/bookings"),
      request("/api/admin/holidays"),
      request("/api/admin/settings"),
    ]);
    setServices(serviceData.services);
    setBookings(bookingData.bookings);
    setHolidays(holidayData.holidays);
    setSettings(settingsData.settings);
  }

  useEffect(() => {
    let active = true;
    Promise.all([
      request("/api/admin/services"),
      request("/api/admin/bookings"),
      request("/api/admin/holidays"),
      request("/api/admin/settings"),
    ])
      .then(([serviceData, bookingData, holidayData, settingsData]) => {
        if (!active) return;
        setServices(serviceData.services);
        setBookings(bookingData.bookings);
        setHolidays(holidayData.holidays);
        setSettings(settingsData.settings);
      })
      .catch((loadError) => {
        if (active) setError(loadError.message);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!isSidebarOpen) return undefined;
    function closeOnEscape(event) {
      if (event.key === "Escape") {
        setIsSidebarOpen(false);
        document.getElementById("admin-sidebar-toggle")?.focus();
      }
    }
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [isSidebarOpen]);

  async function submit(event, action, successMessage) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    const form = event.currentTarget;
    try {
      await action(form);
      form.reset();
      setMessage(successMessage);
      await refresh();
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setBusy(false);
    }
  }

  async function saveService(event) {
    await submit(event, async (form) => {
      const body = Object.fromEntries(new FormData(form));
      await request("/api/admin/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...body,
          priceMinorUnits: Math.round(Number(body.price) * 100),
          durationMinutes: Number(body.durationMinutes),
          currency: "INR",
        }),
      });
    }, "Pricing plan created.");
  }

  async function saveSettings(event) {
    await submit(event, async (form) => {
      const body = Object.fromEntries(new FormData(form));
      await request("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...body,
          defaultMaxMeetings: Number(body.defaultMaxMeetings),
          cancellationHours: Number(body.cancellationHours),
          allowReschedule: body.allowReschedule === "on",
        }),
      });
    }, "Business settings saved.");
  }

  async function saveAvailability(event) {
    await submit(event, async (form) => {
      const body = Object.fromEntries(new FormData(form));
      await request("/api/admin/availability", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...body,
          maxMeetings: Number(body.maxMeetings),
          isAvailable: body.isAvailable === "on",
        }),
      });
    }, "Date availability saved.");
  }

  async function saveHoliday(event) {
    await submit(event, async (form) => {
      const body = Object.fromEntries(new FormData(form));
      await request("/api/admin/holidays", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    }, "Holiday saved.");
  }

  async function updateService(service, form) {
    const body = Object.fromEntries(new FormData(form));
    setError("");
    try {
      await request(`/api/admin/services/${service.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: body.name,
          description: body.description,
          priceMinorUnits: Math.round(Number(body.price) * 100),
          durationMinutes: Number(body.durationMinutes),
          active: service.active,
        }),
      });
      setMessage("Service updated.");
      await refresh();
    } catch (updateError) {
      setError(updateError.message);
    }
  }

  async function toggleService(service) {
    try {
      await request(`/api/admin/services/${service.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !service.active }),
      });
      await refresh();
    } catch (updateError) {
      setError(updateError.message);
    }
  }

  async function updateBooking(event, booking, action) {
    event.preventDefault();
    const form = event.currentTarget;
    const body = { action };
    if (action === "reschedule") {
      body.date = form.elements.date.value;
      body.time = form.elements.time.value;
      if (!window.confirm(`Reschedule this appointment to ${body.date} at ${body.time}?`)) return;
    } else if (action === "cancel" && !window.confirm("Cancel this appointment?")) {
      return;
    }
    try {
      await request(`/api/admin/bookings/${booking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      setMessage(`Appointment ${action}d.`);
      await refresh();
    } catch (updateError) {
      setError(updateError.message);
    }
  }

  const filteredBookings = bookings.filter((booking) => {
    const searchText = search.trim().toLowerCase();
    const localDate = new Intl.DateTimeFormat("en-CA", {
      timeZone: booking.timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(booking.startsAt));
    return (!searchText ||
      booking.user.name.toLowerCase().includes(searchText) ||
      booking.user.email.toLowerCase().includes(searchText)) &&
      (!statusFilter || booking.status === statusFilter) &&
      (!paymentFilter || booking.paymentStatus === paymentFilter) &&
      (!dateFilter || localDate === dateFilter);
  });
  const upcoming = bookings.filter((booking) => booking.status === "CONFIRMED" && new Date(booking.startsAt) > new Date()).length;
  const cancelled = bookings.filter((booking) => booking.status === "CANCELLED").length;
  const paid = bookings.filter((booking) => booking.paymentStatus === "PAID").length;

  return (
    <main className={`${styles.page} ${adminStyles.page}`}>
      <div className={adminStyles.container}>
        <header className={adminStyles.heading}>
          <div>
            <p className={styles.eyebrow}>ADMINISTRATION</p>
            <h1 id="admin-title">Admin panel</h1>
            <p>Manage appointment pricing, availability, holidays, and bookings.</p>
          </div>
          <button
            aria-controls="admin-sidebar"
            aria-expanded={isSidebarOpen}
            aria-label={isSidebarOpen ? "Close admin navigation" : "Open admin navigation"}
            className={adminStyles.sidebarToggle}
            id="admin-sidebar-toggle"
            onClick={() => setIsSidebarOpen((open) => !open)}
            type="button"
          >
            {isSidebarOpen ? <X aria-hidden="true" size={20} /> : <Menu aria-hidden="true" size={20} />}
          </button>
        </header>
        {error && <p className={styles.error} role="alert">{error}</p>}
        {message && <p className={styles.notice} role="status">{message}</p>}

        <div className={adminStyles.layout}>
          {isSidebarOpen && (
            <button
              aria-label="Close admin navigation"
              className={adminStyles.sidebarBackdrop}
              onClick={() => setIsSidebarOpen(false)}
              type="button"
            />
          )}
          <aside
            aria-label="Admin panel"
            className={`${adminStyles.sidebar} ${isSidebarOpen ? adminStyles.sidebarOpen : ""}`}
            id="admin-sidebar"
          >
            <nav aria-label="Admin sections">
              {navigationGroups.map((group) => (
                <div className={adminStyles.navGroup} key={group.label}>
                  <h2>{group.label}</h2>
                  {group.items.map(({ id, label, icon: Icon }) => (
                    <button
                      aria-current={activeSection === id ? "page" : undefined}
                      className={activeSection === id ? adminStyles.activeNavItem : undefined}
                      key={id}
                      onClick={() => {
                        setActiveSection(id);
                        setIsSidebarOpen(false);
                      }}
                      type="button"
                    >
                      <Icon aria-hidden="true" size={18} />
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              ))}
            </nav>
          </aside>

          <div className={adminStyles.content}>
        <section className={adminStyles.overview} hidden={activeSection !== "overview"}>
          <h2>Overview</h2>
          <div className={adminStyles.stats} aria-label="Appointment summary">
            <article><strong>{bookings.length}</strong><span>Appointments</span></article>
            <article><strong>{upcoming}</strong><span>Upcoming</span></article>
            <article><strong>{cancelled}</strong><span>Cancelled</span></article>
            <article><strong>{paid}</strong><span>Paid</span></article>
          </div>
        </section>

        <section className={adminStyles.panel} hidden={activeSection !== "services"}>
          <h2>Pricing plans / services</h2>
          <form className={adminStyles.form} onSubmit={saveService}>
            <label>Name<input name="name" maxLength="100" required /></label>
            <label>Description<textarea name="description" maxLength="2000" rows="2" /></label>
            <label>Price (INR)<input name="price" type="number" min="1" step="0.01" required /></label>
            <label>Duration (minutes)<input name="durationMinutes" type="number" min="15" max="480" step="15" defaultValue="60" required /></label>
            <button disabled={busy} type="submit">Add service</button>
          </form>
          <div className={adminStyles.list}>
            {services.map((service) => (
              <form className={adminStyles.row} key={service.id} onSubmit={(event) => { event.preventDefault(); updateService(service, event.currentTarget); }}>
                <label>Name<input name="name" defaultValue={service.name} maxLength="100" required /></label>
                <label>Description<textarea name="description" defaultValue={service.description} maxLength="2000" rows="2" /></label>
                <label>Price (INR)<input name="price" type="number" min="1" step="0.01" defaultValue={(service.priceMinorUnits / 100).toFixed(2)} required /></label>
                <label>Minutes<input name="durationMinutes" type="number" min="15" max="480" step="15" defaultValue={service.durationMinutes} required /></label>
                <button type="submit">Save</button>
                <button className={adminStyles.secondary} onClick={() => toggleService(service)} type="button">
                  {service.active ? "Disable" : "Enable"}
                </button>
              </form>
            ))}
            {services.length === 0 && <p>No services configured yet.</p>}
          </div>
        </section>

        <section className={adminStyles.panel} hidden={activeSection !== "settings"}>
          <h2>Business settings</h2>
          <form className={adminStyles.form} onSubmit={saveSettings}>
            <label>Timezone<input name="timeZone" defaultValue={settings.timeZone} required /></label>
            <label>Default daily limit<input name="defaultMaxMeetings" type="number" min="0" max="100" defaultValue={settings.defaultMaxMeetings} required /></label>
            <label>Default opening time<input name="defaultOpenTime" type="time" defaultValue={settings.defaultOpenTime} required /></label>
            <label>Default closing time<input name="defaultCloseTime" type="time" defaultValue={settings.defaultCloseTime} required /></label>
            <label>Cancellation notice (hours)<input name="cancellationHours" type="number" min="0" max="720" defaultValue={settings.cancellationHours} required /></label>
            <label className={adminStyles.check}><input name="allowReschedule" type="checkbox" defaultChecked={settings.allowReschedule} /> Allow rescheduling</label>
            <button disabled={busy} type="submit">Save settings</button>
          </form>
        </section>

        <section className={adminStyles.panel} hidden={activeSection !== "availability"}>
          <h2>Date availability</h2>
          <p>Dates without an override use the default hours and daily limit. Set a date to closed or set its limit to zero to stop new bookings.</p>
          <form className={adminStyles.form} onSubmit={saveAvailability}>
            <label>Date<input name="date" type="date" required /></label>
            <label>Daily limit<input name="maxMeetings" type="number" min="0" max="100" defaultValue={settings.defaultMaxMeetings} required /></label>
            <label>Opening time<input name="opensAt" type="time" defaultValue={settings.defaultOpenTime} required /></label>
            <label>Closing time<input name="closesAt" type="time" defaultValue={settings.defaultCloseTime} required /></label>
            <label className={adminStyles.check}><input name="isAvailable" type="checkbox" defaultChecked /> Open for bookings</label>
            <button disabled={busy} type="submit">Save date</button>
          </form>
        </section>

        <section className={adminStyles.panel} hidden={activeSection !== "holidays"}>
          <h2>Holidays and closures</h2>
          <form className={adminStyles.form} onSubmit={saveHoliday}>
            <label>Date<input name="date" type="date" required /></label>
            <label>Reason<input name="description" maxLength="180" required /></label>
            <button disabled={busy} type="submit">Add / update holiday</button>
          </form>
          <ul className={adminStyles.holidays}>
            {holidays.map((holiday) => (
              <li key={holiday.id}>
                <span>{new Date(holiday.date).toISOString().slice(0, 10)} — {holiday.description}</span>
                <button className={adminStyles.secondary} onClick={async () => {
                  try {
                    await request(`/api/admin/holidays/${holiday.id}`, { method: "DELETE" });
                    await refresh();
                  } catch (deleteError) {
                    setError(deleteError.message);
                  }
                }} type="button">Remove</button>
              </li>
            ))}
          </ul>
        </section>

        <section className={adminStyles.panel} hidden={activeSection !== "appointments"}>
          <h2>Appointments</h2>
          <label className={adminStyles.search}>Search by user<input value={search} onChange={(event) => setSearch(event.target.value)} /></label>
          <div className={adminStyles.filters}>
            <label>Status
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                <option value="">All statuses</option>
                {["PENDING_PAYMENT", "CONFIRMED", "CANCELLED", "COMPLETED", "PAYMENT_FAILED"].map((status) => <option key={status}>{status}</option>)}
              </select>
            </label>
            <label>Payment
              <select value={paymentFilter} onChange={(event) => setPaymentFilter(event.target.value)}>
                <option value="">All payment statuses</option>
                {["FREE", "UNPAID", "PAID", "FAILED", "REFUNDED", "PARTIALLY_REFUNDED"].map((status) => <option key={status}>{status}</option>)}
              </select>
            </label>
            <label>Date<input type="date" value={dateFilter} onChange={(event) => setDateFilter(event.target.value)} /></label>
          </div>
          <div className={adminStyles.list}>
            {filteredBookings.map((booking) => (
              <article className={adminStyles.booking} key={booking.id}>
                <h3>{booking.user.name} — {booking.service.name}</h3>
                <p>{booking.user.email} · {dateText(booking.startsAt, booking.timeZone)}</p>
                <p>{booking.status} · {booking.paymentStatus} · {(booking.amountMinorUnits / 100).toLocaleString("en-IN", { style: "currency", currency: booking.payment?.currency ?? "INR" })}</p>
                {booking.payment?.providerPaymentId && <p>Transaction: {booking.payment.providerPaymentId}</p>}
                {["CONFIRMED", "PENDING_PAYMENT"].includes(booking.status) && (
                  <div className={styles.actions}>
                    <form onSubmit={(event) => updateBooking(event, booking, "reschedule")}>
                      <label>Date<input name="date" type="date" required /></label>
                      <label>Time<input name="time" type="time" step="1800" required /></label>
                      <button type="submit">Reschedule</button>
                    </form>
                    {booking.status === "CONFIRMED" && (
                      <button onClick={(event) => updateBooking(event, booking, "complete")} type="button">Mark completed</button>
                    )}
                    <button onClick={(event) => updateBooking(event, booking, "cancel")} type="button">Cancel</button>
                  </div>
                )}
              </article>
            ))}
            {filteredBookings.length === 0 && <p>No appointments match this search.</p>}
          </div>
        </section>
          </div>
        </div>
      </div>
    </main>
  );
}
