import "./Appointments.css";
import { useEffect, useState } from "react";
import { getAppointments } from "../../Services/appointmentService";
import AppointmentCard from "../../components/AppointmentCard/AppointmentCard";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import Message from "../../components/Message/Message";

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState(null);

  async function fetchAppointments() {
    try {
      const data = await getAppointments();
      setAppointments(data);
      setErrorMessage(null);
    } catch (error) {
      console.log("Failed to load appointments:", error);
      setErrorMessage("Failed to load appointments. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      fetchAppointments();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <section className="appointments-page">
        <p>Loading appointments...</p>
      </section>
    );
  }

  return (
    <section className="appointments-page">
      <h1>Appointments</h1>
      <Message
        type="error"
        text={errorMessage}
        clearMessage={setErrorMessage}
        duration={4000}
      />

      {currentUser?.role === "user" && (
        <Link to="/">
          <button>Create new appointment</button>
        </Link>
      )}

      {appointments.length === 0 && <p>No appointments found.</p>}

      <section className="appointments-list">
        {appointments.map((appointment) => (
          <AppointmentCard
            key={appointment._id}
            appointment={appointment}
            onChange={fetchAppointments}
          />
        ))}
      </section>
    </section>
  );
}

export default Appointments;
