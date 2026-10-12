// src/app/layout.js
import "bootstrap/dist/css/bootstrap.min.css";
import "../globals.css";
import BootstrapClient from "@/Components/BootstrapClient";
import DisclaimerPopup from "@/Components/DisclaimerPopup";
import Header from "@/Components/Global Compnents/Header";
import Footer from "@/Components/Global Compnents/Footer";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";



export const metadata = {
  title: "Karan Khetan | Mediator & Arbitrator | India & California",
  description:
    "Cross-border mediator and arbitrator for India–US disputes. Mediation, arbitration and dispute resolution in Nagpur, California and online.",
  alternates: {
    canonical: "https://karankhetan.com/",
  },
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%230C1E35'/%3E%3Ctext x='16' y='22' font-family='serif' font-size='15' font-weight='bold' fill='%23B8925A' text-anchor='middle'%3EKK%3C/text%3E%3C/svg%3E",
  },



  openGraph: {
    title: "Karan Khetan | Mediator & Arbitrator | India & California",
    description:
      "Cross-border mediator and arbitrator for India–US disputes. Mediation, arbitration and dispute resolution in Nagpur, California and online.",
    type: "website",
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <html lang={locale}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&family=Playfair+Display:ital@0;1&display=swap"
          rel="stylesheet"
        />
       <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Karan Khetan",
              jobTitle: "Mediator, Arbitrator and Advocate",
              url: "https://karankhetan.com",
              alumniOf: "Pepperdine Caruso School of Law",
              knowsLanguage: ["English", "Hindi", "Marathi"],
              sameAs: ["https://www.linkedin.com/in/"],
            }),
          }}
        />
      </head>
      <body>
        <NextIntlClientProvider>
          <div id="site-content">
            <Header />
            {children}
            <BootstrapClient />
            <Footer />
          </div>
          <DisclaimerPopup />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
