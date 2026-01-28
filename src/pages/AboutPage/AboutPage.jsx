import { Link } from "react-router-dom";
import "./AboutPage.css";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

function AboutPage() {
  const { isLoggedIn } = useContext(AuthContext);
  return (
    <main className="about-page">
      <section className="about-container">
        <h1>About Right On Time</h1>

        <p className="about-intro">
          Right On Time is a platform that connects people who need services
          with independent professionals who offer them.
        </p>

        <section className="about-section">
          <h2>How does it work?</h2>
          <p>
            Think of Right On Time like Uber — but instead of rides, it connects
            people with freelance service providers.
          </p>
          <p>
            You can browse professionals, check their services, choose a date
            and book an appointment in just a few clicks.
          </p>
        </section>

        <section className="about-section">
          <h2>What kind of services can I find?</h2>
          <p>Any service that an independent professional can offer:</p>

          <ul className="about-services">
            <li>Mechanic</li>
            <li>Babysitters</li>
            <li>Pet Sitters</li>
            <li>Hairdresser & Barber</li>
            <li>Makeup artist</li>
            <li>Cleaner</li>
            <li>Driver & moving services</li>
            <li>Plumber</li>
            <li>Laundry & carpet cleaning</li>
            <li>Musicians</li>
            <li>Photographers</li>
            <li>And many others, its almost infinite!!!</li>
          </ul>
        </section>

        <section className="about-section">
          <h2>If you are looking for a service</h2>
          <p>
            Find trusted professionals, compare services and prices, and book
            appointments when it suits you.
          </p>
        </section>

        <section className="about-section">
          <h2>If you offer services</h2>
          <p>
            Create your profile, list your services, manage your availability
            and connect with new clients easily.
          </p>
        </section>

        {!isLoggedIn && (
          <section className="about-cta">
            <h2>Ready to get started?</h2>
            <p>
              Join Right On Time today and start booking or offering services.
            </p>

            <div>
              <Link to="/register">
                <button>Create an account</button>
              </Link>
            </div>
          </section>
        )}
        
      </section>
    </main>
  );
}

export default AboutPage;
