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
  const pricing = await getTranslations("pricing");
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
              <h3>{pricing("consultationTitle")}</h3>
              <div className="price">{pricing("consultationPrice")}</div>
              <p>{pricing("consultationDescription")}</p>
              <ul className="l">
                <li>{pricing("consultationBullet1")}</li>
                <li>{pricing("consultationBullet2")}</li>
              </ul>
              <a className="btn" href="https://calendar.app.google/qPMYTsG7UpaxcGTi8">
                {nav("consultation")}
              </a>
            </div>
            <div className="card hl">
              <span className="mc">{pricing("mostCommon")}</span>
              <h3>{pricing("mediationTitle")}</h3>
              <div className="price">
                {pricing("mediationPrice")} <small>{pricing("mediationPer")}</small>
              </div>
              <p>{pricing("mediationDescription")}</p>
              <ul className="l">
                <li>{pricing("mediationBullet1")}</li>
                <li>{pricing("mediationBullet2")}</li>
                <li>{pricing("mediationBullet3")}</li>
                <li>{pricing("mediationBullet4")}</li>
              </ul>
              <a className="btn" href="https://calendar.app.google/qPMYTsG7UpaxcGTi8">
                {nav("consultation")}
              </a>
            </div>
            <div className="card">
              <h3>{pricing("resolutionTitle")}</h3>
              <div className="price">{pricing("resolutionPrice")}</div>
              <p>{pricing("resolutionDescription")}</p>
              <ul className="l">
                <li>{pricing("resolutionBullet1")}</li>
                <li>{pricing("resolutionBullet2")}</li>
                <li>{pricing("resolutionBullet3")}</li>
              </ul>
              <Link className="btn" href="/contact">
                {nav("contact")}
              </Link>
            </div>
          </div>
        </div>
      </section>
      <div className="strip">{pricing("strip")}</div>
      <section className="sec alt">
        <div className="in" style={{ textAlign: "center" }}>
          <h2>{shared("ready")}</h2>
          <p style={{ marginBottom: "26px" }}>{shared("conversation")}</p>
          <a className="btn" href="https://calendar.app.google/qPMYTsG7UpaxcGTi8">
            {nav("consultation")}
          </a>
        </div>
      </section>
    </main>
  );
};

export default PricingPage;