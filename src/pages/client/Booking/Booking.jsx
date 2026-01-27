import "./Booking.css";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../../config/config";
import Message from "../../../components/Message/Message";

function Booking() {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state;
  const [provider, setProvider] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (!bookingData) {
      navigate("/");
    }
  }, [bookingData, navigate]);

  useEffect(() => {
    if (!bookingData) {
      setErrorMessage("Invalid booking data.");
      setIsLoading(false);
      return;
    }

    const { providerId } = bookingData;

    async function fetchProvider() {
      try {
        const { data } = await axios.get(`${API_URL}/providers/${providerId}`);
        setProvider(data);
        setErrorMessage(null);
      } catch (err) {
        console.log("Failed to load provider:", err);
        setErrorMessage("Provider not found.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchProvider();
  }, [bookingData, navigate]);

  if (isLoading) {
    return <main className="booking-page">Loading booking information...</main>;
  }

  if (!bookingData) {
    navigate("/");
    return null;
  }

  const { providerId, service } = bookingData || {};

  const today = new Date().toISOString().split("T")[0];

  return (
    <main className="booking-page">
      <h1 className="booking-title">Book service</h1>
      <Message
        type="error"
        text={errorMessage}
        clearMessage={setErrorMessage}
        duration={4000}
      />

      <section className="booking-service-card">
        <h2>{service.name}</h2>
        <p>
          <strong>Price:</strong> €{service.price}
        </p>
        <p>
          <strong>Duration:</strong> {service.durationMinutes} min
        </p>
      </section>

      <section className="booking-date-section">
        <label htmlFor="booking-date">Choose a date</label>

        <input
          id="booking-date"
          type="date"
          min={today}
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </section>

      <button
        className="booking-continue-button"
        disabled={!selectedDate}
        onClick={() =>
          navigate("/calendar", {
            state: {
              providerId,
              service,
              date: selectedDate,
            },
          })
        }
      >
        Continue
      </button>
    </main>
  );
}

export default Booking;
