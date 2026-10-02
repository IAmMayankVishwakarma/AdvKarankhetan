const Contact = () => {
  return (
    <main>
      <section className="hero">
        <span className="badge">
          Confidential. All proceedings are private.
        </span>
        <span className="lab" style={{ color: "var(--g)" }}></span>
        <h1>Get in touch directly</h1>
        <p>
          Family matter, civil issue or complex commercial conflict, I would be
          glad to hear about your situation.
        </p>
        <a className="btn" href="https://calendar.app.google/qPMYTsG7UpaxcGTi8">
          Schedule a Consultation
        </a>
      </section>
      <section className="sec">
        <div className="in split" style={{ gridTemplateColumns: "1fr 1.3fr" }}>
          <div>
            <h2>Contact details</h2>
            <p>
              <b>Email</b>
              <br />
              <a href="mailto:adkkhetan@gmail.com">adkkhetan@gmail.com</a>
            </p>
            <p>
              <b>Phone (US)</b>
              <br />
              <a href="tel:+18057216293">+1 (805) 721-6293</a>
            </p>
            <p>
              <b>Phone (India)</b>
              <br />
              <a href="tel:+919817696856">+91 98176 96856</a>
            </p>
            <p>
              <b>Locations</b>
              <br />
              Nagpur, India and California, USA. Virtual sessions worldwide.
            </p>
            <p>
              <b>Response time</b>
              <br />
              Typically within 24 to 48 hours.
            </p>
            <p>
              <a href="https://www.linkedin.com/in/" rel="noopener">
                LinkedIn
              </a>
            </p>
            <p style={{ marginTop: "24px" }}>
              <a
                className="btn"
                href="https://calendar.app.google/qPMYTsG7UpaxcGTi8"
              >
                Schedule a Consultation
              </a>
            </p>
          </div>
          <form
            className="card"
            action="https://formspree.io/f/YOUR_FORM_ID"
            method="POST"
          >
            <div className="row">
              <div>
                <label htmlFor="fn">First name</label>
                <input id="fn" name="first_name" required />
              </div>
              <div>
                <label htmlFor="ln">Last name</label>
                <input id="ln" name="last_name" required />
              </div>
            </div>
            <label htmlFor="em">Email address</label>
            <input id="em" name="email" type="email" required />
            <label htmlFor="mt2">I am reaching out about</label>
            <select id="mt2" name="matter">
              <option>Family dispute</option>
              <option>Commercial or business dispute</option>
              <option>Cross-border India–US dispute</option>
              <option>Landlord and tenant</option>
              <option>Consumer dispute</option>
              <option>Workplace or ombuds</option>
              <option>Other</option>
            </select>
            <div className="row">
              <div>
                <label htmlFor="dv">Approximate dispute value</label>
                <select id="dv" name="value">
                  <option value="">Select range</option>
                  <option>Under ₹5 lakh</option>
                  <option>₹5 to 50 lakh</option>
                  <option>₹50 lakh to 5 crore</option>
                  <option>Above ₹5 crore</option>
                </select>
              </div>
              <div>
                <label htmlFor="ur">How urgent is this matter?</label>
                <select id="ur" name="urgency">
                  <option value="">Select urgency</option>
                  <option>Within a week</option>
                  <option>Within a month</option>
                  <option>Not urgent</option>
                </select>
              </div>
            </div>
            <label htmlFor="ms">Message</label>
            <textarea id="ms" name="message" rows="5" required></textarea>
            <p className="note" style={{ marginTop: "12px" }}>
              Your message is confidential.
            </p>
            <button
              className="btn"
              style={{ border: "0", cursor: "pointer", marginTop: "16px" }}
            >
              Send Message
            </button>
          </form>
        </div>
      </section>
    </main>
  );}
  export default Contact;