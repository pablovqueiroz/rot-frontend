import "./Appointments.css";
import { useEffect, useState } from "react";
import { getAppointments } from "../../Services/appointmentService";
import AppointmentCard from "../../components/AppointmentCard/AppointmentCard";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import Message from "../../components/Message/Message";
import Spinner from "../../components/spinner/Spinner";

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState(null);

  async function fetchAppointments(isRefresh = false) {
    try {
      if (isRefresh) {
        setIsRefreshing(true);
      }

      const data = await getAppointments();
      setAppointments(data);
      setErrorMessage(null);
    } catch (error) {
      console.log(error);
      setErrorMessage("Failed to load appointments. Please try again.");
    } finally {
      setIsInitialLoading(false);
      setIsRefreshing(false);
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      fetchAppointments();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  if (isInitialLoading) {
    return <Spinner fullscreen />;
  }

  return (
    <section className="appointments-page">
      <h1>Appointments</h1>

      {isRefreshing && <Spinner />}

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
