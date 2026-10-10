import { getTranslations } from "next-intl/server";

export const metadata = {
  title: "Contact | Karan Khetan — Mediator & Arbitrator",
  description:
    "Contact Karan Khetan for mediation and arbitration in India and California. Book a consultation or send a confidential enquiry.",
  alternates: {
    canonical: "https://karankhetan.com/contact",
  },
  keywords: [
    "contact Karan Khetan",
    "mediation consultation",
    "arbitration enquiry",
    "India mediator contact",
    "California mediator contact",
    "confidential dispute resolution",
  ],
  openGraph: {
    title: "Contact | Karan Khetan — Mediator & Arbitrator",
    description:
      "Contact Karan Khetan for mediation and arbitration in India and California. Book a consultation or send a confidential enquiry.",
    url: "https://karankhetan.com/contact",
    type: "website",
  },
};

const ContactPage = async () => {
  const t = await getTranslations("pages");
  const shared = await getTranslations("shared");
  const nav = await getTranslations("navigation");
  const contact = await getTranslations("contact");
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

  return (
    <main>
      <section className="hero">
        <span className="badge">
          {shared("confidential")}
        </span>
        <span className="lab" style={{ color: "var(--g)" }}></span>
        <h1>{t("contactTitle")}</h1>
        <p>{t("contactIntro")}</p>
        <a className="btn" href="https://calendar.app.google/qPMYTsG7UpaxcGTi8">
          {nav("consultation")}
        </a>
      </section>
      <section className="sec">
        <div className="in split" style={{ gridTemplateColumns: "1fr 1.3fr" }}>
          <div>
            <h2>{contact("details")}</h2>
            <p>
              <b>{contact("email")}</b>
              <br />
              <a href="mailto:adkkhetan@gmail.com">adkkhetan@gmail.com</a>
            </p>
            <p>
              <b>{contact("phoneUs")}</b>
              <br />
              <a href="tel:+18057216293">+1 (805) 721-6293</a>
            </p>
            <p>
              <b>{contact("phoneIndia")}</b>
              <br />
              <a href="tel:+919817696856">+91 98176 96856</a>
            </p>
            <p>
              <b>{contact("locations")}</b>
              <br />
              {contact("locationDescription")}
            </p>
            <p>
              <b>{contact("responseTime")}</b>
              <br />
              {contact("responseDescription")}
            </p>
            <p>
              <a href="https://www.linkedin.com/in/" rel="noopener">
                LinkedIn
              </a>
            </p>
            <p style={{ marginTop: "24px" }}>
              <a
                className="btn"
                href="https://calendar.app.google/qPMYTsG7UpaxcGTi8"
              >
                {nav("consultation")}
              </a>
            </p>
          </div>
          <form
            className="card"
            action="https://formspree.io/f/YOUR_FORM_ID"
            method="POST"
          >
            <div className="row">
              <div>
                <label htmlFor="fn">{contact("firstName")}</label>
                <input id="fn" name="first_name" required />
              </div>
              <div>
                <label htmlFor="ln">{contact("lastName")}</label>
                <input id="ln" name="last_name" required />
              </div>
            </div>
            <label htmlFor="em">{contact("emailAddress")}</label>
            <input id="em" name="email" type="email" required />
            <label htmlFor="mt2">{contact("matterPrompt")}</label>
            <select id="mt2" name="matter">
              {contact.raw("matters").map((matter, index) => (
                <option key={matter} value={matterValues[index]}>
                  {matter}
                </option>
              ))}
            </select>
            <div className="row">
              <div>
                <label htmlFor="dv">{contact("valuePrompt")}</label>
                <select id="dv" name="value">
                  <option value="">{contact("selectRange")}</option>
                  {contact.raw("valueRanges").map((range, index) => (
                    <option key={range} value={valueRangeValues[index]}>
                      {range}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="ur">{contact("urgencyPrompt")}</label>
                <select id="ur" name="urgency">
                  <option value="">{contact("selectUrgency")}</option>
                  {contact.raw("urgencies").map((urgency, index) => (
                    <option key={urgency} value={urgencyValues[index]}>
                      {urgency}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <label htmlFor="ms">{contact("message")}</label>
            <textarea id="ms" name="message" rows="5" required></textarea>
            <p className="note" style={{ marginTop: "12px" }}>
              {contact("confidentialMessage")}
            </p>
            <button
              className="btn"
              style={{ border: "0", cursor: "pointer", marginTop: "16px" }}
            >
              {contact("send")}
            </button>
          </form>
        </div>
      </section>
    </main>
  );}
export default ContactPage;