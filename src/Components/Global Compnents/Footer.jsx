import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

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

  return (
    <footer className="foot">
      <div className="in">
        <div>
          <b>Karan Khetan</b>
          <br />
          {shared("footerRole")}
          <br />
          {shared("footerLocation")}
        </div>
        <div>
          {navigation.map(({ href, key }) => (
            <Link href={href} key={key}>
              {t(key)}
            </Link>
          ))}
          <br />
          <a href="mailto:adkkhetan@gmail.com">adkkhetan@gmail.com</a>
          <a href="tel:+18057216293">+1 (805) 721-6293</a>
          <a href="tel:+919817696856">+91 98176 96856</a>
          <a href="https://www.linkedin.com/in/" rel="noopener">
            LinkedIn
          </a>
        </div>
        <span className="badge">{shared("footerConfidential")}</span>
      </div>
    </footer>
  );
}
