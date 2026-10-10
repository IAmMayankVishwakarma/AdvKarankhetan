import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export const metadata = {
  title: "Pricing | Karan Khetan — Mediator",
  description:
    "Transparent mediation fees: consultation from ₹5,000, mediation ₹25K to ₹75K per session, full resolution from ₹1.5L.",
  alternates: {
    canonical: "https://karankhetan.com/pricing",
  },
  keywords: [
    "mediation fees",
    "mediation pricing",
    "dispute resolution consultation",
    "Karan Khetan pricing",
    "mediator fees India",
  ],
  openGraph: {
    title: "Pricing | Karan Khetan — Mediator",
    description:
      "Transparent mediation fees: consultation from ₹5,000, mediation ₹25K to ₹75K per session, full resolution from ₹1.5L.",
    url: "https://karankhetan.com/pricing",
    type: "website",
  },
};

const PricingPage = async () => {
  const t = await getTranslations("pages");
  const shared = await getTranslations("shared");
  const nav = await getTranslations("navigation");

  return (
    <main>
      <section className="hero">
        <span className="badge">{shared("confidential")}</span>
        <span className="lab" style={{ color: "var(--g)" }}></span>
        <h1>{t("pricingTitle")}</h1>
        <p>{t("pricingIntro")}</p>
      </section>
      <section className="sec">
        <div className="in">
          <div className="grid">
            <div className="card">
              <h3>Consultation</h3>
              <div className="price">₹5,000</div>
              <p>
                A focused 45 minute session to understand your dispute and
                define a path forward.
              </p>
              <ul className="l">
                <li>Case clarity and next steps</li>
                <li>Mediation suitability assessment</li>
              </ul>
              <a
                className="btn"
                href="https://calendar.app.google/qPMYTsG7UpaxcGTi8"
              >
                {nav("consultation")}
              </a>
            </div>
            <div className="card hl">
              <span className="mc">Most common</span>
              <h3>Mediation</h3>
              <div className="price">
                ₹25K to ₹75K <small>per session</small>
              </div>
              <p>
                Structured mediation to resolve your dispute without litigation.
              </p>
              <ul className="l">
                <li>2 to 4 hour session</li>
                <li>Confidential and neutral</li>
                <li>Settlement terms drafted</li>
                <li>Most matters resolve in 1 to 3 sessions</li>
              </ul>
              <a
                className="btn"
                href="https://calendar.app.google/qPMYTsG7UpaxcGTi8"
              >
                {nav("consultation")}
              </a>
            </div>
            <div className="card">
              <h3>Resolution</h3>
              <div className="price">₹1.5L+</div>
              <p>
                End-to-end handling of complex, high-stakes or cross-border
                matters.
              </p>
              <ul className="l">
                <li>Multiple sessions</li>
                <li>Strategy and negotiation support</li>
                <li>Cross-border coordination</li>
              </ul>
              <Link className="btn" href="/contact">
                {nav("contact")}
              </Link>
            </div>
          </div>
        </div>
      </section>
      <div className="strip">
        Disputes that are not resolved through mediation typically cost 5 to 10
        times more in litigation fees and time.
      </div>
      <section className="sec alt">
        <div className="in" style={{ textAlign: "center" }}>
          <h2>{shared("ready")}</h2>
          <p style={{ marginBottom: "26px" }}>
            {shared("conversation")}
          </p>
          <a className="btn" href="https://calendar.app.google/qPMYTsG7UpaxcGTi8">
            {nav("consultation")}
          </a>
        </div>
      </section>
    </main>
  );
};

export default PricingPage;