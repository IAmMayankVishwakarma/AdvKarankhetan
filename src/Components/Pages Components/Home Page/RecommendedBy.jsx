import { getTranslations } from "next-intl/server";
import recommendations from "@/data/recommendations";

export default async function RecommendedBy() {
  const t = await getTranslations("home.recommendations");

  return (
    <section className="sec" aria-labelledby="recommendations-title">
      <div className="in">
        <span className="lab">{t("label")}</span>
        <h2 id="recommendations-title">{t("title")}</h2>
        <div className="grid recommendation-grid">
          {recommendations.map((person) => (
            <article className="card recommendation-card" key={person.name}>
              {person.review ? (
                <blockquote className="recommendation-review">
                  {person.review}
                </blockquote>
              ) : (
                <p className="recommendation-pending">{t("pendingReview")}</p>
              )}
              <div className="recommendation-profile">
                {person.designation && (
                  <p className="recommendation-designation">
                    {person.designation}
                  </p>
                )}
                <a
                  className="recommendation-link"
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
