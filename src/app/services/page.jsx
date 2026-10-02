const Servies = () => {
  return (
    <main>
      <section className="hero">
        <span className="badge">Confidential. All proceedings are private.</span>
        <span className="lab" style={{ color: "var(--g)" }}></span>
        <h1>Dispute resolution that works</h1>
        <p>
          Rigorous legal training, cultural intelligence and steady judgement in
          every matter.
        </p>
      </section>
      <section className="sec">
        <div className="in">
          <span className="lab">Eight services</span>
          <div className="grid">
            <div className="card">
              <h3>Mediation</h3>
              <p>
                A confidential, structured process where I help parties reach
                their own resolution. About 70 to 80 percent of mediated cases
                settle.
              </p>
              <div>
                <span className="tag">Commercial</span>
                <span className="tag">Family</span>
                <span className="tag">Cross-border</span>
                <span className="tag">Workplace</span>
              </div>
            </div>
            <div className="card">
              <h3>Arbitration</h3>
              <p>
                A faster, private alternative to court that delivers a binding
                decision without the delay and publicity of litigation.
              </p>
              <div>
                <span className="tag">Commercial</span>
                <span className="tag">International</span>
                <span className="tag">Contract</span>
              </div>
            </div>
            <div className="card">
              <h3>Med-Arb</h3>
              <p>
                A hybrid process. Parties attempt mediation first. If
                unresolved, the matter moves to binding arbitration.
              </p>
              <div>
                <span className="tag">Hybrid</span>
                <span className="tag">Binding</span>
                <span className="tag">Efficient</span>
              </div>
            </div>
            <div className="card">
              <h3>Conflict Coaching</h3>
              <p>
                One-on-one coaching to build communication and de-escalation
                skills before disagreements become disputes.
              </p>
              <div>
                <span className="tag">Individuals</span>
                <span className="tag">Teams</span>
                <span className="tag">Leadership</span>
              </div>
            </div>
            <div className="card">
              <h3>Cultural Intelligence Consulting</h3>
              <p>
                Helping cross-cultural teams and international organisations
                reduce friction and build trust.
              </p>
              <div>
                <span className="tag">India–US</span>
                <span className="tag">Cross-cultural</span>
                <span className="tag">Global teams</span>
              </div>
            </div>
            <div className="card">
              <h3>Virtual Dispute Resolution</h3>
              <p>
                Full online mediation and arbitration across geographies and
                time zones, with particular experience in India–US matters.
              </p>
              <div>
                <span className="tag">Remote</span>
                <span className="tag">India and US</span>
                <span className="tag">International</span>
              </div>
            </div>
            <div className="card">
              <h3>Consumer Dispute Resolution</h3>
              <p>
                Helping consumers and businesses resolve product, service and
                contract disputes without consumer court.
              </p>
              <div>
                <span className="tag">Consumer rights</span>
                <span className="tag">Product disputes</span>
                <span className="tag">Service contracts</span>
              </div>
            </div>
            <div className="card">
              <h3>Ombuds for Corporates</h3>
              <p>
                An independent, confidential ombudsperson who gives employees
                and stakeholders a safe channel to raise concerns early.
              </p>
              <div>
                <span className="tag">Workplace</span>
                <span className="tag">Confidential</span>
                <span className="tag">Organisational</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="sec alt">
        <div className="in">
          <h2>Why mediation</h2>
          <ul className="l">
            <li>Faster than litigation</li>
            <li>Confidential and private</li>
            <li>Cost-efficient</li>
            <li>You retain control of the outcome</li>
          </ul>
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
  );};

export default Servies;