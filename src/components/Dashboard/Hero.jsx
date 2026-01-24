import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="hero">
      <h1>Right On Time</h1>
      <p>Book services with trusted providers, easily and fast.</p>
      <Link to="/about" className="hero-about-link">
        <button>How it works →</button>
      </Link>
    </section>
  );
}

export default Hero;
