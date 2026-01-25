import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

function Hero() {
  const { currentUser } = useContext(AuthContext);
  return (
    <section className="hero">
      <h1>Right On Time</h1>
      {currentUser?.role !== "provider" && (
        <>
          <p>Book services with trusted providers, easily and fast.</p>

          <Link to="/about" className="hero-about-link">
            <button>How it works →</button>
          </Link>
        </>
      )}
    </section>
  );
}

export default Hero;
