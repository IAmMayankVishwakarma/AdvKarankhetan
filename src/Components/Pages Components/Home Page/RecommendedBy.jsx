import { getTranslations } from "next-intl/server";
import recommendations from "@/data/recommendations";
import site from "@/Components/site.module.css";
import styles from "./RecommendedBy.module.css";

export default async function RecommendedBy() {
  const t = await getTranslations("home.recommendations");

  return (
    <section className={site.section} aria-labelledby="recommendations-title">
      <div className={site.container}>
        <span className={site.eyebrow}>{t("label")}</span>
        <h2 id="recommendations-title">{t("title")}</h2>
        <div className={site.grid}>
          {recommendations.map((person) => (
            <article className={`${site.card} ${styles.card}`} key={person.name}>
              {person.review ? (
                <blockquote className={styles.review}>
                  {person.review}
                </blockquote>
              ) : (
                <p className={styles.pending}>{t("pendingReview")}</p>
              )}
              <div className={styles.profile}>
                {person.designation && (
                  <p className={styles.designation}>
                    {person.designation}
                  </p>
                )}
                <a
                  className={styles.profileLink}
                  href={person.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t("profileLink", { name: person.name })}
                >
                  {person.name}
                  <span aria-hidden="true"> ↗</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
