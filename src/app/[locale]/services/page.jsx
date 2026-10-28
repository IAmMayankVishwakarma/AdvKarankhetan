import { getTranslations } from "next-intl/server";
import styles from "./page.module.css";
import site from "@/Components/site.module.css";
import { Link } from "@/i18n/navigation";

export const metadata = {
  title: "Services | Karan Khetan — Mediator",
  description:
    "Mediation, arbitration, med-arb, conflict coaching, corporate ombuds and virtual dispute resolution for India–US and commercial matters.",
  alternates: {
    canonical: "https://karankhetan.com/services",
  },
  keywords: [
    "mediation services",
    "arbitration",
    "med-arb",
    "conflict coaching",
    "corporate ombuds",
    "India-US dispute resolution",
    "virtual mediation",
  ],
  openGraph: {
    title: "Services | Karan Khetan — Mediator",
    description:
      "Mediation, arbitration, med-arb, conflict coaching, corporate ombuds and virtual dispute resolution for India–US and commercial matters.",
    url: "https://karankhetan.com/services",
    type: "website",
  },
};

const legalServiceSchema = {
  "@context": "https://schema.org",
  "@type": "LegalService",
  name: "Karan Khetan, Mediator and Arbitrator",
  url: "https://karankhetan.com",
  areaServed: ["India", "United States"],};

const Services = async () => {
  const t = await getTranslations("pages");
  const services = await getTranslations("services");
  const shared = await getTranslations("shared");
  const nav = await getTranslations("navigation");

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(legalServiceSchema) }}
      />
      <section className={site.hero}>
        <span className={site.eyebrow}></span>
        <h1>{t("servicesTitle")}</h1>
        <p>{t("servicesIntro")}</p>
      </section>
      <section className={site.section}>
        <div className={site.container}>
          <span className={site.eyebrow}>{services("titleLabel")}</span>
          <div className={site.grid}>
            {services.raw("cards").map((card) => (
              <div className={`${site.card} ${styles.serviceCard}`} key={card.title}>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
                <div className={styles.serviceTags}>
                  {card.tags.map((tag) => (
                    <span className={site.tag} key={`${card.title}-${tag}`}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className={`${site.section} ${site.altSection}`}>
        <div className={site.container}>
          <h2>{services("whyTitle")}</h2>
          <ul className={site.list}>
            {services.raw("whyList").map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>
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

export default Services;
