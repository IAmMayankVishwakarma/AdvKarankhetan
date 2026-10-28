import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import styles from "./page.module.css";
import site from "@/Components/site.module.css";

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
      <section className={site.hero}>
        {/* <span className="badge">{shared("confidential")}</span> */}
        <span className={site.eyebrow}></span>
        <h1>{t("pricingTitle")}</h1>
        <p>{t("pricingIntro")}</p>
      </section>
      <section className={site.section}>
        <div className={site.container}>
          <div className={site.grid}>
            <div className={`${site.card} ${styles.pricingCard}`}>
              <h3>{pricing("consultationTitle")}</h3>
              <div className={styles.price}>{pricing("consultationPrice")}</div>
              <p>{pricing("consultationDescription")}</p>
              <ul className={`${site.list} ${styles.benefits}`}>
                <li>{pricing("consultationBullet1")}</li>
                <li>{pricing("consultationBullet2")}</li>
              </ul>
              <Link className={site.button} href="/book">
                {nav("consultation")}
              </Link>
            </div>
            <div className={`${site.card} ${styles.pricingCard} ${styles.popularCard}`}>
              <span className={styles.popularLabel}>{pricing("mostCommon")}</span>
              <h3>{pricing("mediationTitle")}</h3>
              <div className={styles.price}>
                {pricing("mediationPrice")} <small>{pricing("mediationPer")}</small>
              </div>
              <p>{pricing("mediationDescription")}</p>
              <ul className={`${site.list} ${styles.benefits}`}>
                <li>{pricing("mediationBullet1")}</li>
                <li>{pricing("mediationBullet2")}</li>
                <li>{pricing("mediationBullet3")}</li>
                <li>{pricing("mediationBullet4")}</li>
              </ul>
              <Link className={site.button} href="/book">
                {nav("consultation")}
              </Link>
            </div>
            <div className={`${site.card} ${styles.pricingCard}`}>
              <h3>{pricing("resolutionTitle")}</h3>
              <div className={styles.price}>{pricing("resolutionPrice")}</div>
              <p>{pricing("resolutionDescription")}</p>
              <ul className={`${site.list} ${styles.benefits}`}>
                <li>{pricing("resolutionBullet1")}</li>
                <li>{pricing("resolutionBullet2")}</li>
                <li>{pricing("resolutionBullet3")}</li>
              </ul>
              <Link className={site.button} href="/contact">
                {nav("contact")}
              </Link>
            </div>
          </div>
        </div>
      </section>
      <div className={`${site.strip} ${styles.pricingStrip}`}>{pricing("strip")}</div>
      <section className={`${site.section} ${site.altSection}`}>
        <div className={`${site.container} ${site.centered}`}>
          <h2>{shared("ready")}</h2>
          <p className={styles.closingText}>{shared("conversation")}</p>
          <Link className={site.button} href="/book">
            {nav("consultation")}
          </Link>
        </div>
      </section>
    </main>
  );
};

export default PricingPage;