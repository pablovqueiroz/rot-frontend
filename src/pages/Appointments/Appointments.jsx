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
  const [statusFilters, setStatusFilters] = useState({
    scheduled: true,
    confirmed: true,
    completed: false,
    cancelled: false,
  });

  //sort by status
  const STATUS_PRIORITY = {
    scheduled: 1,
    confirmed: 2,
    completed: 3,
    cancelled: 4,
  };

  //sort by date/status
  function compareAppointments(a, b) {
    const statusDiff = STATUS_PRIORITY[a.status] - STATUS_PRIORITY[b.status];

    if (statusDiff !== 0) {
      return statusDiff;
    }

    const dateDiff = new Date(a.date) - new Date(b.date);

    if (dateDiff !== 0) {
      return dateDiff;
    }
    return a.startTime.localeCompare(b.startTime);
  }

  //fetch appointments
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

  //sync appointments
  useEffect(() => {
    const interval = setInterval(() => {
      fetchAppointments();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  if (isInitialLoading) {
    return <Spinner fullscreen />;
  }

  //filter appointments
  const filteredAppointments = appointments.filter((appointment) => {
    if (appointment.status === "no_show") {
      return false;
    }

    return statusFilters[appointment.status];
  });

  //sort by order
  const sortedAppointments = [...filteredAppointments].sort(
    compareAppointments,
  );

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

      <div className="appointments-filters">
        {Object.keys(statusFilters).map((status) => (
          <button
            key={status}
            className={`filter-button ${statusFilters[status] ? "active" : ""}`}
            onClick={() =>
              setStatusFilters((prev) => ({
                ...prev,
                [status]: !prev[status],
              }))
            }
          >
            {status.replace("_", " ")}
          </button>
        ))}
      </div>

      <section className="appointments-list">
        {sortedAppointments.map((appointment) => (
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
