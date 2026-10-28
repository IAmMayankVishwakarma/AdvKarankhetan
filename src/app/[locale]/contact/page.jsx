import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
// import { Linkedin } from "lucide-react";
import { FaLinkedin as Linkedin } from "react-icons/fa";
import styles from "./page.module.css";
import site from "@/Components/site.module.css";
import ContactForm from "./ContactForm";

export const metadata = {
  title: "Contact | Karan Khetan — Mediator & Arbitrator",
  description:
    "Contact Karan Khetan for mediation and arbitration in India and California. Book a consultation or send a confidential enquiry.",
  alternates: {
    canonical: "https://karankhetan.com/contact",
  },
  keywords: [
    "contact Karan Khetan",
    "mediation consultation",
    "arbitration enquiry",
    "India mediator contact",
    "California mediator contact",
    "confidential dispute resolution",
  ],
  openGraph: {
    title: "Contact | Karan Khetan — Mediator & Arbitrator",
    description:
      "Contact Karan Khetan for mediation and arbitration in India and California. Book a consultation or send a confidential enquiry.",
    url: "https://karankhetan.com/contact",
    type: "website",
  },
};

const linkedInProfile = "https://www.linkedin.com/in/karan-khetan-5b462942";

const ContactPage = async () => {
  const t = await getTranslations("pages");
  const nav = await getTranslations("navigation");
  const contact = await getTranslations("contact");

  return (
    <main>
      <section className={site.hero}>
        {/* <span className="badge">{shared("confidential")}</span> */}
        <span className={site.eyebrow}></span>
        <h1>{t("contactTitle")}</h1>
        <p>{t("contactIntro")}</p>
        <Link
          className={site.button}
          href="/book"
        >
          {nav("consultation")}
        </Link>
      </section>
      <section className={site.section}>
        <div className={`${site.container} ${site.split} ${styles.contactLayout}`}>
          <div className={styles.contactDetails}>
            <h2>{contact("details")}</h2>
            <p>
              <b>{contact("email")}</b>
              <br />
              <a href="mailto:adkkhetan@gmail.com">adkkhetan@gmail.com</a>
            </p>
            <p>
              <b>{contact("locations")}</b>
              <br />
              {contact("locationDescription")}
            </p>
            <p>
              <b>{contact("responseTime")}</b>
              <br />
              {contact("responseDescription")}
            </p>
            <p>
              <a
                className={styles.socialLink}
                href={linkedInProfile}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Karan Khetan LinkedIn profile"
              >
                <Linkedin size={16} aria-hidden="true" />
                <span>LinkedIn</span>
              </a>
            </p>
            <p className={styles.consultationLink}>
              <Link
                className={site.button}
                href="/book"
              >
                {nav("consultation")}
              </Link>
            </p>
          </div>
          <ContactForm />
        </div>
      </section>
    </main>
  );
};
export default ContactPage;
