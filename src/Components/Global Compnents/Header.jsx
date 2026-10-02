import Link from 'next/link';

const Header = () => {
  return (
    <>
      <header>
        <nav aria-label="Main">
          {/* Next.js Link का उपयोग करें और class को className में बदलें */}
          <Link className="logo" href="/">
            Karan <i>Khetan</i>
          </Link>
          
          {/* Input टैग को अंत में /> से बंद किया गया है */}
          <input type="checkbox" id="mt" />
          
          {/* HTML style स्ट्रिंग को React ऑब्जेक्ट फॉर्मेट में बदला गया है */}
          <label
            className="burger"
            htmlFor="mt" /* 'for' की जगह 'htmlFor' का उपयोग होता है */
            aria-label="Menu"
            style={{
              margin: 0,
              fontSize: '26px',
              letterSpacing: 0,
              textTransform: 'none',
            }}
          >
            ☰
          </label>
          
          <ul>
            <li>
              <Link href="/" className="nav-link on" aria-current="page">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about">About</Link>
            </li>
            <li>
              <Link href="/services">Services</Link>
            </li>
            <li>
              <Link href="/credentials">Credentials</Link>
            </li>
            <li>
              <Link href="/pricing">Pricing</Link>
            </li>
            <li>
              <Link href="/contact">Contact</Link>
            </li>
          </ul>
          
          <a className="btn" href="https://calendar.app.google/qPMYTsG7UpaxcGTi8" target="_blank" rel="noopener noreferrer">
            Schedule a Consultation
          </a>
        </nav>
      </header>
    </>
  );
};

export default Header;
