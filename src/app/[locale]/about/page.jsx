import Image from "next/image";
import { getTranslations } from "next-intl/server";
import styles from "./page.module.css";
import site from "@/Components/site.module.css";

export const metadata = {
  title: "Neutral Profile | Karan Khetan — Mediator & Arbitrator",
  description:
    "Karan Khetan is a cross-border arbitrator and mediator for India–US disputes. Pepperdine Straus LL.M. Family dispute mediator in Nagpur and California.",
  alternates: {
    canonical: "https://karankhetan.com/about",
  },
  keywords: [
    "Karan Khetan",
    "Mediator",
    "Arbitrator",
    "Ombudsperson",
    "Conflict Coach",
    "India-US dispute resolution",
    "Nagpur mediator",
    "California mediator",
    "family dispute mediator",
    "cross-border mediation",
  ],
  openGraph: {
    title: "Neutral Profile | Karan Khetan — Mediator & Arbitrator",
    description:
      "Karan Khetan is a cross-border arbitrator and mediator for India–US disputes. Pepperdine Straus LL.M. Family dispute mediator in Nagpur and California.",
    url: "https://karankhetan.com/about",
    type: "website",
  },
};

export default async function AboutPage() {
  const t = await getTranslations("pages");
  const about = await getTranslations("about");
  const shared = await getTranslations("shared");
  const nav = await getTranslations("navigation");

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Karan Khetan",
    jobTitle: "Mediator, Arbitrator and Advocate",
    url: "https://karankhetan.com",
    alumniOf: "Pepperdine Caruso School of Law",
    knowsLanguage: ["English", "Hindi", "Marathi"],
    sameAs: ["https://www.linkedin.com/in/"],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <main>
        <section className={site.hero}>
          {/* <span className="badge">{shared("confidential")}</span> */}
          <span className={site.eyebrow}></span>
          <h1>{t("aboutTitle")}</h1>
          <p>{t("aboutIntro")}</p>
        </section>
        <section className={site.section}>
          <div className={`${site.container} ${site.split}`}>
            <div className={styles.portraitFrame}>
              <Image
                src="/image/personal/Adv karan khetan.jpeg"
                alt="Karan Khetan, mediator and arbitrator specialising in India–US cross-border dispute resolution"
                width={500}
                height={500}
              />
            </div>
            <div>
              <span className={site.eyebrow}>{about("roleDesignations")}</span>
              <div>
                {about.raw("roleTags").map((tag) => (
                  <span className={site.tag} key={tag}>{tag}</span>
                ))}
              </div>

              <h2 className={styles.sectionHeadingFirst}>{about("biography")}</h2>
              <p>{about("bioParagraph1")}</p>
              <p>{about("bioParagraph2")}</p>
              <p>{about("bioParagraph3")}</p>

              <h2 className={styles.sectionHeading}>{about("approach")}</h2>
              <p>{about("approachParagraph1")}</p>
              <p>{about("approachParagraph2")}</p>

              <h2 className={styles.sectionHeading}>{about("practiceAreas")}</h2>
              <div>
                {about.raw("tagList").map((tag) => (
                  <span className={site.tag} key={tag}>{tag}</span>
                ))}
              </div>

              <h2 className={styles.sectionHeading}>{about("industries")}</h2>
              <div>
                {about.raw("industryTags").map((tag) => (
                  <span className={site.tag} key={tag}>{tag}</span>
                ))}
              </div>

              <h2 className={styles.sectionHeading}>{about("representativeMatters")}</h2>
              <ul className={site.list}>
                {about.raw("representativeList").map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <p className={site.note}>{about("noPartyNames")}</p>

              <h2 className={styles.sectionHeading}>{about("memberships")}</h2>
              <p>{about("membershipsText")}</p>

              <p className={styles.downloadLink}>
                <a
                  className={`${site.button} ${site.outlineButton}`}
                  href="Karan-Khetan-Neutral-Profile.pdf"
                  target="_blank"
                  rel="noopener"
                >
                  {shared("downloadCv")}
                </a>
              </p>
            </div>
          </div>
        </section>
        <section className={`${site.section} ${site.altSection}`}>
          <div className={`${site.container} ${site.centered}`}>
            <h2>{shared("ready")}</h2>
            <p className={styles.closingText}>{shared("conversation")}</p>
            <a className={site.button} href="https://calendar.app.google/qPMYTsG7UpaxcGTi8">
              {nav("consultation")}
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
