import { getTranslations } from "next-intl/server";

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
  areaServed: ["India", "United States"],
  telephone: "+1-805-721-6293",
};

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
      <section className="hero">
        <span className="badge">{shared("confidential")}</span>
        <span className="lab" style={{ color: "var(--g)" }}></span>
        <h1>{t("servicesTitle")}</h1>
        <p>{t("servicesIntro")}</p>
      </section>
      <section className="sec">
        <div className="in">
          <span className="lab">{services("titleLabel")}</span>
          <div className="grid">
            {services.raw("cards").map((card) => (
              <div className="card" key={card.title}>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
                <div>
                  {card.tags.map((tag) => (
                    <span className="tag" key={`${card.title}-${tag}`}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="sec alt">
        <div className="in">
          <h2>{services("whyTitle")}</h2>
          <ul className="l">
            {services.raw("whyList").map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>
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

export default Services;
