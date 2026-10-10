import Image from "next/image";
import { getTranslations } from "next-intl/server";

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
      <section className="hero">
        <span className="badge">{shared("confidential")}</span>
        <span className="lab" style={{ color: "var(--g)" }}></span>
        <h1>{t("credentialsTitle")}</h1>
        <p>{t("credentialsIntro")}</p>
      </section>
      <section className="sec">
        <div className="in">
          <h2>Education</h2>
          <div className="grid">
            <div className="card">
              <h3>LL.M., Dispute Resolution</h3>
              <p>
                Straus Institute, Pepperdine Caruso School of Law. Malibu,
                California.
              </p>
            </div>
            <div className="card">
              <h3>PG Diploma, Medical Legal Ethics</h3>
              <p>National Law School of India University. Bangalore.</p>
            </div>
            <div className="card">
              <h3>B.A. LL.B. (Hons.)</h3>
              <p>Jindal Global Law School. Sonipat, Haryana. 2017 to 2022.</p>
            </div>
          </div>
          <h2 style={{ marginTop: "60px" }}>Education and professional experience</h2>
          <div className="credential-gallery">
            {credentialImages.map((image) => (
              <figure className="credential-photo" key={image.src}>
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 33vw"
                />
              </figure>
            ))}
          </div>
          <h2 style={{ marginTop: "60px" }}>Court work</h2>
          <div className="grid">
            <div className="card">
              <h3>White Collar Claims</h3>
              <p>Court-annexed mediation of civil white-collar claims.</p>
            </div>
            <div className="card">
              <h3>Small Claims</h3>
              <p>Court-annexed assistance in Small Claims proceedings.</p>
            </div>
            <div className="card">
              <h3>Unlawful Detainer</h3>
              <p>Mediation in landlord and tenant eviction matters.</p>
            </div>
            <div className="card">
              <h3>Civil Harassment</h3>
              <p>
                Structured dialogue in civil harassment restraining order cases.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="sec alt">
        <div className="in">
          <h2>Memberships</h2>
          <p>
            Bar Council of Maharashtra and Goa. [Number, year and any mediation
            panels to be added.]
          </p>
          <h2 style={{ marginTop: "40px" }}>Publications</h2>
          <p>
            [Articles on India–US enforcement of arbitral awards and culturally
            intelligent mediation to be listed here.]
          </p>
          <h2 style={{ marginTop: "40px" }}>Skills</h2>
          <div>
            <span className="tag">Mediation</span>
            <span className="tag">Arbitration</span>
            <span className="tag">Med-Arb</span>
            <span className="tag">Negotiation</span>
            <span className="tag">Cultural intelligence</span>
            <span className="tag">Emotional intelligence</span>
            <span className="tag">Conflict coaching</span>
            <span className="tag">Contract law</span>
            <span className="tag">Family law</span>
            <span className="tag">Cross-border disputes</span>
          </div>
          <p style={{ marginTop: "30px" }}>
            <a
              className="btn"
              href="Karan-Khetan-Neutral-Profile.pdf"
              target="_blank"
              rel="noopener"
            >
              {shared("downloadCv")}
            </a>
          </p>
        </div>
      </section>
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

export default CredentialsPage;