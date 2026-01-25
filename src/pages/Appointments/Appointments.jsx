import "./Appointments.css";
import { useEffect, useState } from "react";
import { getAppointments } from "../../Services/appointmentService";
import AppointmentCard from "../../components/AppointmentCard/AppointmentCard";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useContext(AuthContext);

  async function fetchAppointments() {
    try {
      const data = await getAppointments();
      setAppointments(data);
    } catch (error) {
      console.log("Failed to load appointments", error);
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
    return <p>Loading appointments...</p>;
  }

  return (
    <section className="appointments-page">
      <h1>Appointments</h1>

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
