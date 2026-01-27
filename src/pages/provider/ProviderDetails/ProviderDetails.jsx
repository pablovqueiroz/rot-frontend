import "./ProviderDetails.css";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_URL } from "../../../config/config";
import axios from "axios";
import Message from "../../../components/Message/Message";

function ProviderDetails() {
  const { id } = useParams();
  const [provider, setProvider] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    async function fetchProvider() {
      try {
        const response = await axios.get(`${API_URL}/providers/${id}`);
        setProvider(response.data);
      } catch (error) {
        console.log("Provider not found.", error);
        setErrorMessage("Provider not found.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchProvider();
  }, [id]);

  if (isLoading) {
    return <p>Loading provider...</p>;
  }

  const { name, image, bio, services = [], phone, email } = provider;

  function handleGoHome() {
    nav("/");
  }
  const hasAvailability =
    provider.availability && provider.availability.length > 0;

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
      <Message
        type="error"
        text={errorMessage}
        clearMessage={setErrorMessage}
        duration={4000}
      />

      <section className="provider-header">
        <img src={image.url} alt={name} className="provider-avatar" />

        <div className="provider-info">
          <h1>{name}</h1>

          {bio && <p className="provider-bio">{bio}</p>}

          <div className="provider-contact">
            {phone && (
              <p>
                <strong>Phone:</strong> {phone}
              </p>
            )}

            {email && (
              <p>
                <strong>Email:</strong> {email}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="provider-services-container">
        <h1>Services</h1>

        {services.length === 0 && (
          <p>This provider has no services available.</p>
        )}

        <ul className="services-list-details">
          {services.map((service) => (
            <li key={service.id || `${service.name}-${service.price}`} className="service-card">
              <h3>{service.name}</h3>
              <p>
                <strong>Price: </strong> €{service.price}
              </p>
              <p>
                <strong>Duration: </strong> {service.durationMinutes} min
              </p>

              <button
                disabled={!hasAvailability}
                onClick={() => handleBookService(service)}
              >
                Book service
              </button>

              {!hasAvailability && (
                <p className="form-hint">
                  Sorry, there are no available times at the moment.
                </p>
              )}
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
