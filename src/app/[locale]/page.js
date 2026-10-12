import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import RecommendedBy from "@/Components/Pages Components/Home Page/RecommendedBy";
// import styles from "./page.module.css";

export const metadata = {
  title: "Karan Khetan | Mediator & Arbitrator | India & California",
  description:
    "Cross-border mediator and arbitrator for India–US disputes. Mediation, arbitration and dispute resolution in Nagpur, California and online.",
  alternates: {
    canonical: "https://karankhetan.com/",
  },
  keywords: [
    "Karan Khetan",
    "India-US mediator",
    "cross-border arbitrator",
    "Nagpur mediation",
    "California mediation",
    "online dispute resolution",
  ],
  openGraph: {
    title: "Karan Khetan | Mediator & Arbitrator | India & California",
    description:
      "Cross-border mediator and arbitrator for India–US disputes. Mediation, arbitration and dispute resolution in Nagpur, California and online.",
    url: "https://karankhetan.com/",
    type: "website",
  },
};

export default async function HomePage() {
  const t = await getTranslations("home");
  const shared = await getTranslations("shared");
  const nav = await getTranslations("navigation");

  return (
    <>
      <main>
        <section className="hero">
          <span className="badge">
            {shared("confidential")}
          </span>
          <span className="lab" style={{ color: "var(--g)" }}>
            {t("role")}
          </span>
          <h1>{t("headline")}</h1>
          <p>{t("intro")}</p>
          <a
            className="btn" 
            href="https://calendar.app.google/qPMYTsG7UpaxcGTi8"
             style={{ marginLeft: "12%" }}
          >
            {nav("consultation")}
          </a>
        </section>
        <div className="strip">
          {t("institutions")}
        </div>
        <section className="sec">
          <div className="in home-profile">
            <Image
              className="home-profile-image"
              src="/image/personal/WhatsApp Image 2026-09-13 at 10.53.50 PM.jpeg"
              alt="Karan Khetan in his office"
              width={900}
              height={1350}
              sizes="(max-width: 820px) 100vw, 45vw"
            />
            <div>
              <span className="lab">{t("profileLabel")}</span>
              <h2>{t("profileTitle")}</h2>
              <p>{t("profileText")}</p>
              <Link className="btn line" href="/about">
                {t("meet")}
              </Link>
            </div>
          </div>
        </section>
        <section className="sec">
          <div className="in">
            <span className="lab">{t("whyLabel")}</span>
            <h2>{t("whyTitle")}</h2>
            <div className="grid">
              <div className="card">
                <h3>{t("faster")}</h3>
                <p>{t("fasterText")}</p>
              </div>
              <div className="card">
                <h3>{t("confidentialTitle")}</h3>
                <p>{t("confidentialText")}</p>
              </div>
              <div className="card">
                <h3>{t("cost")}</h3>
                <p>{t("costText")}</p>
              </div>
              <div className="card">
                <h3>{t("control")}</h3>
                <p>{t("controlText")}</p>
              </div>
            </div>
          </div>
        </section>
        <section className="quote">
          <p className="q">
            {t("quote")}
          </p>
          <small>{t("quoteAttribution")}</small>
        </section>
        <section className="sec">
          <div className="in">
            <span className="lab">{t("practiceLabel")}</span>
            <h2>{t("practiceTitle")}</h2>
            <div>
              {t.raw("practiceTypes").map((type) => (
                <span className="tag" key={type}>
                  {type}
                </span>
              ))}
            </div>
            <p style={{ margin: "28px 0 22px" }}>
              {t("serviceIntro")}
            </p>
            <Link className="btn line" href="/services">
              {t("viewServices")}
            </Link>
          </div>
        </section>
        <section className="sec alt">
          <div className="in">
            <span className="lab">{t("outcomesLabel")}</span>
            <h2>{t("outcomesTitle")}</h2>
            <div className="grid">
              <div className="card">
                <p>{t("review1")}</p>
                <p className="note">{t("review1Note")}</p>
              </div>
              <div className="card">
                <p>{t("review2")}</p>
                <p className="note">{t("review2Note")}</p>
              </div>
              <div className="card">
                <p>{t("review3")}</p>
                <p className="note">{t("review3Note")}</p>
              </div>
            </div>
          </div>
        </section>
        <RecommendedBy />
        <section className="sec alt">
          <div className="in" style={{ textAlign: "center" }}>
            <h2>{shared("ready")}</h2>
            <p style={{ marginBottom: "26px" }}>
              {shared("conversation")}
            </p>
            <a
              className="btn"
              href="https://calendar.app.google/qPMYTsG7UpaxcGTi8"
            >
              {nav("consultation")}
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
