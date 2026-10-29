import { getTranslations } from "next-intl/server";
// import { Linkedin } from "lucide-react";
import { FaLinkedin as Linkedin} from "react-icons/fa";
import { FaEnvelope as Gmail } from "react-icons/fa";
import { Link } from "@/i18n/navigation";
import styles from "./Footer.module.css";

const navigation = [
  { href: "/", key: "home" },
  { href: "/about", key: "about" },
  { href: "/services", key: "services" },
  { href: "/credentials", key: "credentials" },
  { href: "/pricing", key: "pricing" },
  { href: "/contact", key: "contact" },
];

export default async function Footer() {
  const t = await getTranslations("navigation");
  const shared = await getTranslations("shared");
  const linkedInProfile = "https://www.linkedin.com/in/karan-khetan-5b462942";

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.identity}>
          <b>Karan Khetan</b>
          <br />
          {shared("footerRole")}
          <br />
          {shared("footerLocation")}
        </div>
        <div className={styles.linkGroups}>
          <nav aria-label="Footer" className={styles.footerNav}>
            {navigation.map(({ href, key }) => (
              <Link href={href} key={key}>
                {t(key)}
              </Link>
            ))}
          </nav>
          <div className={styles.contactLinks}>
<<<<<<< HEAD
            <a href="mailto:adkkhetan@gmail.com">adkkhetan@gmail.com</a>
            <a href="https://www.linkedin.com/in/" rel="noopener">
              LinkedIn
=======
            {/* <a href="mailto:adkkhetan@gmail.com">adkkhetan@gmail.com</a> */}
            <a
              className={styles.socialLink}
              href="mailto:adkkhetan@gmail.com" 
              target="_blank"
              aria-label="Karan Khetan Gmail"
            >
              <Gmail size={16} aria-hidden="true" />
              <span>Gmail</span>
            </a>
            <a
              className={styles.socialLink}
              href={linkedInProfile}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Karan Khetan LinkedIn profile"
            >
              <Linkedin size={16} aria-hidden="true" />
              <span>LinkedIn</span>
>>>>>>> 8e182f2a239f0185f3bc3cc5f5a634e5d123ae23
            </a>
          </div>
        </div>
        {/* <span className="badge">{shared("footerConfidential")}</span> */}
      </div>
    </footer>
  );
}
