import "./AppointmentCard.css";
import { useContext, useState } from "react";
import { API_URL } from "../../config/config";
import { AuthContext } from "../../context/AuthContext";
import Message from "../Message/Message";

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
function AppointmentCard({ appointment, onChange }) {
  if (!appointment) {
    return null;
  }
  const { service, date, startTime, endTime, status, provider, client } =
    appointment;

  const [errorMessage, setErrorMessage] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const [successMessage, setSuccessMessage] = useState(null);
  const contact = currentUser.role === "provider" ? client : provider;

  //to cancel appointment
  async function handleCancel() {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this appointment?",
    );

    if (!confirmCancel) {
      return;
    }

    try {
      const token = localStorage.getItem("authToken");

      const response = await fetch(
        `${API_URL}/api/appointments/${appointment._id}/cancel`,
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
      setErrorMessage(null);
    } catch (error) {
      console.error("Cancel appointment error:", error);
      setErrorMessage("Something went wrong. Please try again.");
    }
  }

  //to update appointment
  async function updateStatus(newStatus) {
    try {
      setErrorMessage(null);

      const token = localStorage.getItem("authToken");

      const response = await fetch(
        `${API_URL}/api/appointments/${appointment._id}/status`,
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
      console.error("Update appointment status error:", error);
      setErrorMessage("Failed to update appointment status.");
    }
  }

  //filter appointments

  return (
    <div>
      <div className="appointment-card">
        <h3>{service.name}</h3>

        <p>
          {new Date(date).toLocaleDateString()} · {startTime} – {endTime}
        </p>
        <section className="status-container">
          <span
            className={`appointment-status ${STATUS_CONFIG[status]?.className}`}
          >
            {STATUS_CONFIG[status]?.label}
          </span>
          {currentUser.role === "provider" && status === "scheduled" && (
            <button onClick={() => updateStatus("confirmed")}>Confirm</button>
          )}
        </section>

        <div className="appointmentcard-footer">
          <section className="appointment-contact">
            <p>
              <strong>
                {currentUser.role === "provider" ? "Client" : "Provider"}:
              </strong>{" "}
              {contact ? contact.name : "Available"}
            </p>

            {contact?.email && (
              <p>
                <strong>Email:</strong> {contact.email}
              </p>
            )}

            {contact?.phone && (
              <p>
                <strong>Phone:</strong> {contact.phone}
              </p>
            )}
          </section>

          <section className="buttons">
            {currentUser.role === "provider" && status === "confirmed" && (
              <button onClick={() => updateStatus("completed")}>
                Completed
              </button>
            )}

            {status !== "cancelled" && status !== "completed" && (
              <button onClick={handleCancel} className="cancel-button">
                Cancel
              </button>
            )}

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
          </section>
        </div>
      </div>
    </div>
  );
}

export default AppointmentCard;
