import Image from "next/image";
// import styles from "./page.module.css";

export default function Home() {
  return (
    <>
      <main>
        <section className="hero">
          <span className="badge">Confidential. All proceedings are private.</span>
          <span className="lab" style={{ color: "var(--g)" }}>
            Mediator, Arbitrator, Advocate
          </span>
          <h1>Resolve disputes. Efficiently. Confidentially. Decisively.</h1>
          <p>
            A dual-jurisdiction neutral for family, civil and commercial
            disputes between India and the United States. Resolve faster, with
            control and clarity.
          </p>
          <a className="btn" href="https://calendar.app.google/qPMYTsG7UpaxcGTi8">
            Schedule a Consultation
          </a>
        </section>
        <div className="strip">
          Pepperdine Straus Institute. Bombay High Court. NLSIU Bangalore.
          California court-annexed programmes.
        </div>
        <section className="sec">
          <div className="in">
            <span className="lab">Why mediation</span>
            <h2>A faster route to a lasting outcome</h2>
            <div className="grid">
              <div className="card">
                <h3>Faster</h3>
                <p>
                  Most matters resolve in one to three sessions, far quicker
                  than litigation.
                </p>
              </div>
              <div className="card">
                <h3>Confidential</h3>
                <p>
                  Everything discussed stays private. No court involvement
                  unless you choose it.
                </p>
              </div>
              <div className="card">
                <h3>Cost-efficient</h3>
                <p>
                  Matters that fail to settle often cost five to ten times more
                  in litigation fees and time.
                </p>
              </div>
              <div className="card">
                <h3>You decide</h3>
                <p>
                  The parties shape the outcome. The neutral never imposes one
                  in mediation.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="quote">
          <p className="q">
            "The courts of this country should not be the places where
            resolution of disputes begins. They should be the places where
            disputes end, after alternative methods have been considered and
            tried."
          </p>
          <small>Justice Sandra Day O'Connor, U.S. Supreme Court</small>
        </section>
        <section className="sec">
          <div className="in">
            <span className="lab">Practice areas</span>
            <h2>Matters I handle</h2>
            <div>
              <span className="tag">Family and succession</span>
              <span className="tag">Cross-border India–US</span>
              <span className="tag">Commercial and business</span>
              <span className="tag">Consumer disputes</span>
              <span className="tag">Ombuds for corporates</span>
              <span className="tag">Landlord and tenant</span>
              <span className="tag">Workplace conflicts</span>
              <span className="tag">Civil harassment</span>
              <span className="tag">Medical legal disputes</span>
            </div>
            <p style={{ margin: "28px 0 22px" }}>
              Eight services across mediation, arbitration, coaching and
              corporate ombuds work.
            </p>
            <a className="btn line" href="services.html">
              View all services
            </a>
          </div>
        </section>
        <section className="sec alt">
          <div className="in">
            <span className="lab">Client outcomes</span>
            <h2>What clients say</h2>
            <div className="grid">
              <div className="card">
                <p>
                  "We fought over inherited property for nearly a decade. We
                  reached an agreement in two sessions."
                </p>
                <p className="note">R.S. Family property dispute, India</p>
              </div>
              <div className="card">
                <p>
                  "We were at a complete deadlock. We walked out with a deal
                  that worked for both of us."
                </p>
                <p className="note">J.M. Commercial contract dispute, California</p>
              </div>
              <div className="card">
                <p>
                  "He navigated the cultural and legal nuances on both sides
                  with real fluency."
                </p>
                <p className="note">
                  A.K. Cross-border business dispute, India and US
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="sec alt">
          <div className="in" style={{ textAlign: "center" }}>
            <h2>Ready to resolve?</h2>
            <p style={{ marginBottom: "26px" }}>
              A focused, confidential 30 to 45 minute conversation. No
              obligation.
            </p>
            <a className="btn" href="https://calendar.app.google/qPMYTsG7UpaxcGTi8">
              Schedule a Consultation
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
