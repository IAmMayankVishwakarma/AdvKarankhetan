import Image from "next/image";
import { getTranslations } from "next-intl/server";

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
        <section className="hero">
          <span className="badge">{shared("confidential")}</span>
          <span className="lab" style={{ color: "var(--g)" }}></span>
          <h1>{t("aboutTitle")}</h1>
          <p>{t("aboutIntro")}</p>
        </section>
        <section className="sec">
          <div className="in split">
            <div className="photo">
              <Image
                src="/image/personal/Adv karan khetan.jpeg"
                alt="Karan Khetan, mediator and arbitrator specialising in India–US cross-border dispute resolution"
                width={500}
                height={500}
              />
            </div>
            <div>
              <span className="lab">{about("roleDesignations")}</span>
              <div>
                {about.raw("roleTags").map((tag) => (
                  <span className="tag" key={tag}>{tag}</span>
                ))}
              </div>

              <h2 style={{ marginTop: "28px" }}>{about("biography")}</h2>
              <p>{about("bioParagraph1")}</p>
              <p>{about("bioParagraph2")}</p>
              <p>{about("bioParagraph3")}</p>

              <h2 style={{ marginTop: "40px" }}>{about("approach")}</h2>
              <p>{about("approachParagraph1")}</p>
              <p>{about("approachParagraph2")}</p>

              <h2 style={{ marginTop: "40px" }}>{about("practiceAreas")}</h2>
              <div>
                {about.raw("tagList").map((tag) => (
                  <span className="tag" key={tag}>{tag}</span>
                ))}
              </div>

              <h2 style={{ marginTop: "40px" }}>{about("industries")}</h2>
              <div>
                {about.raw("industryTags").map((tag) => (
                  <span className="tag" key={tag}>{tag}</span>
                ))}
              </div>

              <h2 style={{ marginTop: "40px" }}>{about("representativeMatters")}</h2>
              <ul className="l">
                {about.raw("representativeList").map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <p className="note">{about("noPartyNames")}</p>

              <h2 style={{ marginTop: "40px" }}>{about("memberships")}</h2>
              <p>{about("membershipsText")}</p>

              <p style={{ marginTop: "30px" }}>
                <a
                  className="btn line"
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
        <section className="sec alt">
          <div className="in" style={{ textAlign: "center" }}>
            <h2>{shared("ready")}</h2>
            <p style={{ margin: "0 0 26px" }}>{shared("conversation")}</p>
            <a className="btn" href="https://calendar.app.google/qPMYTsG7UpaxcGTi8">
              {nav("consultation")}
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
