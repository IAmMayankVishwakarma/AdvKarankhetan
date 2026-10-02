const Credentials = () => {
  return (
    <main>
      <section className="hero">
        <span className="badge">Confidential. All proceedings are private.</span>
        <span className="lab" style={{ color: "var(--g)" }}></span>
        <h1>Credentials</h1>
        <p>Education, court work, memberships and publications.</p>
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
              Download CV
            </a>
          </p>
        </div>
      </section>
      <section className="sec alt">
        <div className="in" style={{ textAlign: "center" }}>
          <h2>Ready to resolve?</h2>
          <p style={{ marginBottom: "26px" }}>
            A focused, confidential 30 to 45 minute conversation. No obligation.
          </p>
          <a className="btn" href="https://calendar.app.google/qPMYTsG7UpaxcGTi8">
            Schedule a Consultation
          </a>
        </div>
      </section>
    </main>
  );
};

export default Credentials;