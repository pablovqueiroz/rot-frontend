import "./Calendar.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../../config/config";
import Message from "../../../components/Message/Message";
import Spinner from "../../../components/spinner/Spinner";

function Calendar() {
  const location = useLocation();
  const nav = useNavigate();
  const bookingData = location.state;
  const [provider, setProvider] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  //get providers + appointments
  useEffect(() => {
    if (!bookingData || !bookingData.providerId) {
      setErrorMessage("Invalid booking data.");
      setIsLoading(false);
      return;
    }

    async function fetchProvider() {
      try {
        const { providerId } = bookingData;

        const { data } = await axios.get(`${API_URL}/api/providers/${providerId}`);

        setProvider(data);
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "Failed to load provider.";

        console.log(errorMessage, error);
        setErrorMessage(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProvider();
  }, [bookingData]);

  //calculate slots (to unblock slots)
  useEffect(() => {
    if (!bookingData?.providerId || !bookingData?.date) return;

    async function fetchBlockedAppointments() {
      try {
        const { data } = await axios.get(`${API_URL}/api/appointments/blocked`, {
          params: {
            providerId: bookingData.providerId,
            date: bookingData.date,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });

        setAppointments(data);
      } catch (err) {
        console.log("Failed to reload blocked appointments", err);
        setAppointments([]);
      }
    }

    fetchBlockedAppointments();
  }, [bookingData?.providerId, bookingData?.date]);

  //get slots availables
  useEffect(() => {
    if (!provider || !provider.availability || !bookingData) return;

    const { date, service } = bookingData;

    const selectDate = new Date(`${date}T12:00:00`);
    const dayOfWeek = selectDate.getDay(); // (schema: 0 - 6)
    console.log("Selected date:", date);
    console.log("Day of week:", dayOfWeek);
    console.log("Provider availability:", provider.availability);

    if (!provider.availability || provider.availability.length === 0) {
      setAvailableSlots([]);
      return;
    }

    const dayAvailability = provider.availability.find(
      (available) => available.dayOfWeek === dayOfWeek,
    );

    if (!dayAvailability) {
      setAvailableSlots([]);
      return;
    }

    const slots = [];

    const [startHour, startMinutes] = dayAvailability.startTime
      .split(":")
      .map(Number);

    const [endHour, endMinutes] = dayAvailability.endTime
      .split(":")
      .map(Number);

    const end = endHour * 60 + endMinutes;

    const serviceDuration = service.durationMinutes;

    for (
      let current = startHour * 60 + startMinutes;
      current + serviceDuration <= end;
      current += 30
    ) {
      const startTime = minutesToTime(current);
      const endTime = minutesToTime(current + serviceDuration);

      const conflict = appointments.some(
        (appt) =>
          timeToMinutes(appt.startTime) < current + serviceDuration &&
          timeToMinutes(appt.endTime) > current,
      );

      if (!conflict) {
        slots.push({ startTime, endTime });
      }
    }

    setAvailableSlots(slots);
  }, [provider, appointments, bookingData]);

  const { service, date, providerId } = bookingData || {};

  function timeToMinutes(time) {
    const [hour, min] = time.split(":").map(Number);
    return hour * 60 + min;
  }

  function minutesToTime(minutes) {
    const hour = String(Math.floor(minutes / 60)).padStart(2, "0");
    const min = String(minutes % 60).padStart(2, "0");
    return `${hour}:${min}`;
  }

  //creat a appointment
  async function createAppointment({
    providerId,
    service,
    date,
    startTime,
    endTime,
  }) {
    try {
      setIsSubmitting(true);

      await axios.post(
        `${API_URL}/api/appointments`,
        {
          provider: providerId,
          service,
          date,
          startTime,
          endTime,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        },
      );
      setErrorMessage(null);
      setSuccessMessage(
        "Your appointment was created and is awaiting provider confirmation.",
      );
    } catch (err) {
      console.log("Create appointment error:", err);
      setErrorMessage("Failed to create appointment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    if (!successMessage) return;

    const timer = setTimeout(() => {
      nav("/my-appointments");
    }, 3000);

    return () => clearTimeout(timer);
  }, [successMessage, nav]);

  useEffect(() => {
    if (!bookingData) {
      nav("/");
    }
  }, [bookingData, nav]);

  if (!bookingData) {
    return null;
  }

  if (isLoading) {
    return <Spinner fullscreen text="Loading calendar..." />;
  }

  return (
    <main className="calendar-page">
      <section className="calendar-title">
        <h1>Select a time</h1>
      </section>
      <Message
        type="success"
        text={successMessage}
        clearMessage={setSuccessMessage}
      />

      <Message
        type="error"
        text={errorMessage}
        clearMessage={setErrorMessage}
        duration={4000}
      />
      <p>
        {service.name} — {service.durationMinutes} min
      </p>
      <p>Date: {date}</p>

      {availableSlots.length === 0 && <p>No available times for this day.</p>}

      <ul className="slots-list">
        {availableSlots.map((slot, index) => (
          <li key={index}>
            <button
              disabled={isSubmitting}
              onClick={() =>
                createAppointment({
                  providerId,
                  service,
                  date,
                  startTime: slot.startTime,
                  endTime: slot.endTime,
                })
              }
            >
              {slot.startTime} – {slot.endTime}
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
export default Calendar;
