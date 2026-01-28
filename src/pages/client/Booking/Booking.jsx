import "./Booking.css";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../../config/config";
import Message from "../../../components/Message/Message";
import Spinner from "../../../components/spinner/Spinner";

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
        const { data } = await axios.get(`${API_URL}/api/providers/${providerId}`);
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
    return <Spinner fullscreen text="Loading booking information..." />;
  }

  if (!bookingData) {
    navigate("/");
    return null;
  }

  const { providerId, service } = bookingData || {};

  const today = new Date().toISOString().split("T")[0];

  //disable dates unavailables
  function isDateAvailable(dateString, availability) {
    if (!availability) return false;

    const date = new Date(`${dateString}T12:00:00`);
    const dayOfWeek = date.getDay();

    return availability.some((slot) => slot.dayOfWeek === dayOfWeek);
  }

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
          onChange={(e) => {
            const value = e.target.value;

            if (!isDateAvailable(value, provider.availability)) {
              setErrorMessage(
                "This provider does not work on the selected day.",
              );
              setSelectedDate("");
              return;
            }

            setErrorMessage(null);
            setSelectedDate(value);
          }}
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
