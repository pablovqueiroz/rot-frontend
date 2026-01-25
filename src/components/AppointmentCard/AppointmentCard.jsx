import "./AppointmentCard.css";
import { useContext, useState } from "react";
import { API_URL } from "../../config/config";
import { AuthContext } from "../../context/AuthContext";

function AppointmentCard({ appointment, onChange }) {
  const STATUS_CONFIG = {
    scheduled: {
      label: "Awaiting confirmation",
      className: "status-scheduled",
    },
    confirmed: {
      label: "Confirmed",
      className: "status-confirmed",
    },
    completed: {
      label: "Completed",
      className: "status-completed",
    },
    cancelled: {
      label: "Cancelled",
      className: "status-cancelled",
    },
  };

  const { service, date, startTime, endTime, status, provider, client } =
    appointment;

  const [errorMessage, setErrorMessage] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isHidden, setIsHidden] = useState(false);
  const contact = currentUser.role === "provider" ? client : provider;

  if (isHidden) {
    return null;
  }

  //to cancel appointment
  async function handleCancel() {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this appointment?",
    );

    if (!confirmCancel) {
      return;
    }

    try {
      setErrorMessage(null);

      const token = localStorage.getItem("authToken");

      const response = await fetch(
        `${API_URL}/appointments/${appointment._id}/cancel`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to cancel appointment");
      }
      setTimeout(() => {
        onChange();
      }, 3000);

      setSuccessMessage("Appointment cancelled successfully.");
    } catch (error) {
      console.log(error);
      setErrorMessage("Something went wrong. Please try again.");
    }
  }

  //to update appointment
  async function updateStatus(newStatus) {
    try {
      setErrorMessage(null);

      const token = localStorage.getItem("authToken");

      const response = await fetch(
        `${API_URL}/appointments/${appointment._id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      onChange();
    } catch (error) {
      console.log(error);
      setErrorMessage("Failed to update appointment status.");
    }
  }

  return (
    <div>
      <article className="appointment-card">
        <h3>{service.name}</h3>

        <p>
          {new Date(date).toLocaleDateString()} · {startTime} – {endTime}
        </p>

        <span
          className={`appointment-status ${STATUS_CONFIG[status]?.className}`}
        >
          {STATUS_CONFIG[status]?.label}
        </span>

        {currentUser.role === "provider" && status === "scheduled" && (
          <button onClick={() => updateStatus("confirmed")}>Confirm</button>
        )}
        <div className="appointment-contact">
          <p>
            <strong>
              {currentUser.role === "provider" ? "Client" : "Provider"}:
            </strong>{" "}
            {contact.name}
          </p>

          {contact.email && (
            <p>
              <strong>Email:</strong> {contact.email}
            </p>
          )}

          {contact.phone && (
            <p>
              <strong>Phone:</strong> {contact.phone}
            </p>
          )}
        </div>

        {currentUser.role === "provider" && status === "confirmed" && (
          <button onClick={() => updateStatus("completed")}>Completed</button>
        )}

        {status !== "cancelled" && status !== "completed" && (
          <button onClick={handleCancel}>Cancel</button>
        )}

        {successMessage && <p className="form-success">{successMessage}</p>}
        {errorMessage && <p className="form-error">{errorMessage}</p>}
        {["completed", "cancelled"].includes(status) && (
          <button onClick={() => setIsHidden(true)} className="clear-button">
            Hide
          </button>
        )}
      </article>
    </div>
  );
}

export default AppointmentCard;
