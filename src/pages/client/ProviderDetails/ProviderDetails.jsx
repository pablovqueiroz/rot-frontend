import "./ProviderDetails.css";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_URL } from "../../../config/config";
import axios from "axios";

function ProviderDetails() {
  const { id } = useParams();
  const [provider, setProvider] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    async function fetchProvider() {
      try {
        const response = await axios.get(`${API_URL}/providers/${id}`);
        setProvider(response.data);
      } catch (err) {
        console.log(err);
        setError("Provider not found", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProvider();
  }, [id]);

  if (isLoading) {
    return <p>Loading provider...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const { name, image, bio, services = [] } = provider;

  function handleGoHome() {
    nav("/");
  }

  function handleBookService(service) {
    nav("/booking", {
      state: {
        providerId: provider._id,
        service: {
          name: service.name,
          price: service.price,
          durationMinutes: service.durationMinutes,
        },
      },
    });
  }

  return (
    <main className="provider-details">
      <section className="provider-header">
        <img src={image.url} alt={name} className="provider-avatar" />

        <div className="provider-info">
          <h1>{name}</h1>

          {bio && <p className="provider-bio">{bio}</p>}
        </div>
      </section>

      <section className="provider-services-container">
        <h1>Services</h1>

        {services.length === 0 && (
          <p>This provider has no services available.</p>
        )}

        <ul className="services-list">
          {services.map((service) => (
            <li key={service.id} className="service-card">
              <h3>{service.name}</h3>
              <p>
                <strong>Price: </strong> €{service.price}
              </p>
              <p>
                <strong>Duration: </strong> {service.durationMinutes} min
              </p>
              <button onClick={() => handleBookService(service)}>
                Book service
              </button>
            </li>
          ))}
        </ul>
      <button className="back-home-button" onClick={handleGoHome}>
        ⬅ Back to Home
      </button>
      </section>
    </main>
  );
}
export default ProviderDetails;
