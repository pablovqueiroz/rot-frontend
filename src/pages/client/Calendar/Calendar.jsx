import "./Calendar.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../../config/config";

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

  useEffect(() => {
    if (!bookingData) {
      nav("/");
    }
  }, [bookingData, nav]);

  //get providers + appointments
  useEffect(() => {
    if (!bookingData) return;
    const token = localStorage.getItem("authToken");
    const { providerId, date } = bookingData;

    async function fetchData() {
      try {
        const [providerRes, appointmentsRes] = await Promise.all([
          axios.get(`${API_URL}/providers/${providerId}`),
          axios.get(`${API_URL}/appointments`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);
        setProvider(providerRes.data);
        const filteredAppointments = appointmentsRes.data.filter(
          (appt) =>
            appt.provider._id === providerId &&
            appt.date.slice(0, 10) === date &&
            appt.status !== "cancelled",
        );
        setAppointments(filteredAppointments);
      } catch (err) {
        console.log(err);
        setErrorMessage("Fail to fetch data", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [bookingData, nav]);

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
  }, [provider?.availability, appointments, bookingData]);

  if (!bookingData) {
    return <p>Missing booking data</p>;
  }

  if (isLoading) {
    return <p>Loading calendar...</p>;
  }

  const { service, date, providerId } = bookingData;

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
      setErrorMessage(null);
      setSuccessMessage(null);

      await axios.post(
        `${API_URL}/appointments`,
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

      setSuccessMessage(
        "Your appointment was created and is awaiting provider confirmation.",
      );

      setTimeout(() => {
        nav("/my-appointments");
      }, 3000);
    } catch (err) {
      console.log(err);
      setErrorMessage(
        "This time slot is no longer available. Please choose another one.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="calendar-page">
      <section className="calendar-title">
        {successMessage && (
          <div className="booking-success">
            <p>{successMessage}</p>
            <p>You will be redirected shortly.</p>
          </div>
        )}

        {errorMessage && (
          <div className="booking-error">
            <p>{errorMessage}</p>
          </div>
        )}

        <h1>Select a time</h1>
      </section>
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
