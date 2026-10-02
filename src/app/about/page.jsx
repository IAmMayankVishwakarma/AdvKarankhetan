export default function About() {
  return (
      <main>
    <section className="hero"><span className="badge">Confidential. All proceedings are private.</span><span className="lab"
        style={{ color: 'var(--g)' }}></span>
      <h1>Neutral Profile</h1>
      <p>Karan Khetan, Mediator, Arbitrator, Ombudsperson and Conflict Coach.</p>
    </section>
    <section className="sec">
      <div className="in split">
        <div className="photo">
          <img src="karan-khetan.jpg" alt="Karan Khetan, mediator and arbitrator specialising in India–US cross-border dispute resolution" />
          {/* <!-- Headshot placeholder<br />(1200×1200, formal, neutral backdrop) --> */}
        </div>
        <div><span className="lab">Role designations</span>
          <div><span className="tag">Mediator</span><span className="tag">Arbitrator</span><span
              className="tag">Ombudsperson</span><span className="tag">Conflict Coach</span></div>
          <h2 style={{ marginTop: '28px' }}>Biography</h2>
          <p>Karan Khetan is a mediator and advocate who resolves family, civil and commercial disputes across India and
            the United States. He is qualified in India and trained in the United States, with practice in Nagpur and
            California.</p>
          <p>He holds an LL.M. from the Straus Institute for Dispute Resolution at Pepperdine Caruso School of Law, a
            Post Graduate Diploma in Medical Legal Ethics from NLSIU Bangalore, and a B.A. LL.B. (Hons.) from Jindal
            Global Law School.</p>
          <p>He volunteers as a court-annexed mediator in California, in White Collar, Small Claims, Unlawful Detainer
            and Civil Harassment programmes. He has settled long-running family disputes that had resisted conventional
            litigation. He works in English, Hindi and Marathi.</p>
          <h2 style={{ marginTop: '40px' }}>Approach</h2>
          <p>My approach is preparation-led and culturally informed. I study the dispute before the first session. I
            listen for what each party needs, which is often different from what they demand.</p>
          <p>Culture shapes how people argue, concede and trust. I address it directly, so that it becomes a bridge and
            not a barrier. Parties can expect candour, structure and respect for their time.</p>
          <h2 style={{ marginTop: '40px' }}>Practice areas</h2>
          <div><span className="tag">Family and succession</span><span className="tag">Cross-border India–US</span><span
              className="tag">Commercial and business</span><span className="tag">Consumer disputes</span><span
              className="tag">Ombuds for corporates</span><span className="tag">Landlord and tenant</span><span
              className="tag">Workplace conflicts</span><span className="tag">Civil harassment</span><span className="tag">Medical
              legal disputes</span><span className="tag">Small claims</span><span className="tag">White collar civil
              claims</span></div>
          <h2 style={{ marginTop: '40px' }}>Industries</h2>
          <div><span className="tag">Hospitality</span><span className="tag">Healthcare</span><span className="tag">Real
              estate</span><span className="tag">Manufacturing</span><span className="tag">Retail and consumer goods</span><span
              className="tag">Legal and professional services</span></div>
          <h2 style={{ marginTop: '40px' }}>Representative matters</h2>
          <ul className="l">
            <li>Mediated a family succession dispute between two branches of a joint family in India. Resolved in two
              sessions after years of failed litigation.</li>
            <li>Served as court-annexed mediator in a civil harassment matter in California. Settled on the day of the
              session.</li>
            <li>Mediated a commercial contract deadlock between two business partners in California. Resolved without
              trial.</li>
            <li>Assisted landlord and tenant parties in an unlawful detainer matter in Los Angeles County. Settled in
              one session.</li>
            <li>Facilitated a cross-border business dispute involving Indian and American parties. Resolved through
              virtual mediation.</li>
            <li>Assisted parties in a California Small Claims matter. Reached an enforceable settlement without formal
              representation.</li>
          </ul>
          <p className="note">Matters are anonymised. No party names or case numbers appear on this site.</p>
          <h2 style={{ marginTop: '40px' }}>Languages and locations</h2>
          <p>English (fluent), Hindi (fluent), Marathi (fluent). Nagpur, India (primary). California, USA. Available
            virtually worldwide.</p>
          <h2 style={{ marginTop: '40px' }}>Memberships</h2>
          <p>Bar Council of Maharashtra and Goa. [Enrolment number and year to be added.]</p>
          <p style={{ marginTop: '30px' }}><a className="btn line" href="Karan-Khetan-Neutral-Profile.pdf" target="_blank"
              rel="noopener">Download CV</a></p>
        </div>
      </div>
    </section>
    <section className="sec alt">
      <div className="in" style={{ textAlign: 'center' }}>
        <h2>Ready to resolve?</h2>
        <p style={{ margin: '0 0 26px' }}>A focused, confidential 30 to 45 minute conversation. No obligation.</p><a
          className="btn" href="https://calendar.app.google/qPMYTsG7UpaxcGTi8">Schedule a Consultation</a>
      </div>
    </section>
  </main>
  );
}
