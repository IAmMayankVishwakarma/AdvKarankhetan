import Image from "next/image";
import { getTranslations } from "next-intl/server";
import styles from "./page.module.css";
import site from "@/Components/site.module.css";

export const metadata = {
  title: "Credentials | Karan Khetan — Mediator",
  description:
    "Education and credentials: Pepperdine Straus LL.M., NLSIU Medical Legal Ethics, Jindal Global Law School. Court-annexed mediation in California.",
  alternates: {
    canonical: "https://karankhetan.com/credentials",
  },
  keywords: [
    "Karan Khetan credentials",
    "Pepperdine Straus LL.M.",
    "NLSIU Medical Legal Ethics",
    "Jindal Global Law School",
    "California court-annexed mediator",
  ],
  openGraph: {
    title: "Credentials | Karan Khetan — Mediator",
    description:
      "Education and credentials: Pepperdine Straus LL.M., NLSIU Medical Legal Ethics, Jindal Global Law School. Court-annexed mediation in California.",
    url: "https://karankhetan.com/credentials",
    type: "website",
  },
};

const CredentialsPage = async () => {
  const t = await getTranslations("pages");
  const credentials = await getTranslations("credentials");
  const shared = await getTranslations("shared");
  const nav = await getTranslations("navigation");

  const credentialImages = [
    {
      src: "/image/education/WhatsApp Image 2026-09-26 at 12.10.12 PM.jpeg",
      alt: "Karan Khetan at a Pepperdine Caruso School of Law event",
    },
    {
      src: "/image/education/WhatsApp Image 2026-09-26 at 12.10.30 PM.jpeg",
      alt: "Karan Khetan with colleagues in a courtroom",
    },
    {
      src: "/image/education/WhatsApp Image 2026-09-26 at 12.13.37 PM.jpeg",
      alt: "Karan Khetan with a colleague in a courtroom",
    },
    {
      src: "/image/education/WhatsApp Image 2026-09-26 at 12.13.41 PM.jpeg",
      alt: "Karan Khetan at a Mediation Center of Los Angeles event",
    },
    {
      src: "/image/education/WhatsApp Image 2026-09-26 at 12.13.52 PM.jpeg",
      alt: "Graduates celebrating at an outdoor commencement ceremony",
    },
    {
      src: "/image/education/WhatsApp Image 2026-09-26 at 12.14.12 PM.jpeg",
      alt: "Karan Khetan at the American Arbitration Association International Centre for Dispute Resolution",
    },
    {
      src: "/image/education/WhatsApp Image 2026-09-26 at 12.14.41 PM.jpeg",
      alt: "Karan Khetan with classmates during his studies in California",
    },
    {
      src: "/image/education/WhatsApp Image 2026-09-26 at 12.15.16 PM.jpeg",
      alt: "Karan Khetan with classmates in a law school classroom",
    },
    {
      src: "/image/education/WhatsApp Image 2026-09-26 at 12.17.02 PM.jpeg",
      alt: "Karan Khetan speaking with a colleague at a professional gathering",
    },
    {
      src: "/image/education/WhatsApp Image 2026-09-26 at 12.17.18 PM.jpeg",
      alt: "Karan Khetan with colleagues at a professional gathering",
    },
    {
      src: "/image/education/WhatsApp Image 2026-09-26 at 12.18.05 PM.jpeg",
      alt: "Karan Khetan celebrating his Pepperdine Caruso School of Law graduation with a fellow graduate",
    },
  ];

  return (
    <main>
      <section className={site.hero}>
        {/* <span className="badge">{shared("confidential")}</span> */}
        <span className={site.eyebrow}></span>
        <h1>{t("credentialsTitle")}</h1>
        <p>{t("credentialsIntro")}</p>
      </section>
      <section className={site.section}>
        <div className={site.container}>
          <h2>{credentials("educationTitle")}</h2>
          <div className={site.grid}>
            {credentials.raw("cards").map((card) => (
              <div className={site.card} key={card.title}>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </div>
            ))}
          </div>
          <h2 className={styles.sectionHeading}>{credentials("experienceTitle")}</h2>
          <div className={styles.gallery}>
            {credentialImages.map((image) => (
              <figure className={styles.galleryItem} key={image.src}>
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 33vw"
                />
              </figure>
            ))}
          </div>
          <h2 className={styles.sectionHeading}>{credentials("courtWorkTitle")}</h2>
          <div className={site.grid}>
            {credentials.raw("courtCards").map((card) => (
              <div className={site.card} key={card.title}>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className={`${site.section} ${site.altSection}`}>
        <div className={site.container}>
          <h2>{credentials("membershipsTitle")}</h2>
          <p>{credentials("membershipsText")}</p>
          <h2 className={styles.sectionHeading}>{credentials("publicationsTitle")}</h2>
          <p>{credentials("publicationsText")}</p>
          <h2 className={styles.sectionHeading}>{credentials("skillsTitle")}</h2>
          <div>
            {credentials.raw("skills").map((skill) => (
              <span className={site.tag} key={skill}>{skill}</span>
            ))}
          </div>
          <p className={styles.closingText}>
            <a
              className={site.button}
              href="Karan-Khetan-Neutral-Profile.pdf"
              target="_blank"
              rel="noopener"
            >
              {shared("downloadCv")}
            </a>
          </p>
        </div>
      </section>
      <section className={`${site.section} ${site.altSection}`}>
        <div className={`${site.container} ${site.centered}`}>
          <h2>{shared("ready")}</h2>
          <p className={styles.ctaText}>{shared("conversation")}</p>
          <a className={site.button} href="https://calendar.app.google/qPMYTsG7UpaxcGTi8">
            {nav("consultation")}
          </a>
        </div>
      </section>
    </main>
  );
};

export default CredentialsPage;