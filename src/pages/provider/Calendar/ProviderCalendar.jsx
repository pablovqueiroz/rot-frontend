import "./ProviderCalendar.css";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import enUS from "date-fns/locale/en-US";
import { useEffect, useState } from "react";
import useCalendarEvents from "../../../hooks/useCalendarEvents";
import { getAppointments } from "../Services/appointmentService";


// Calendar event styles (react-big-calendar)
  const STATUS_COLORS = {
    scheduled: "var(--color-warning)",
    confirmed: "var(--color-success)",
    completed: "var(--color-primary)",
    cancelled: "var(--calendar-blocked)",
    no_show: "var(--calendar-blocked)",
  };

  function eventStyleGetter(event) {
    const backgroundColor =
      STATUS_COLORS[event.status] || "var(--color-border)";

    const style = {
      backgroundColor,
      borderRadius: "6px",
      opacity:
        event.status === "cancelled" || event.status === "no_show" ? 0.5 : 1,
      color: "var(--color-text-primary)",
      border: "1px solid var(--color-border)",
      cursor:
        event.status === "cancelled" || event.status === "no_show"
          ? "not-allowed"
          : "pointer",
    };

    return { style };
  }
  //end of calendar styles

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

function ProviderCalendar() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAppointments() {
      try {
        const data = await getAppointments();
        console.log("Appointments from backend:", data);
        setAppointments(data);
      } catch (error) {
        console.log("Error fetching appointments", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAppointments();
  }, []);

  const events = useCalendarEvents(appointments);

  if (loading) {
    return <p>Loading calendar...</p>;
  }

  return (
    <div className="provider-calendar">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        defaultView="week"
        views={["week", "day"]}
        eventPropGetter={eventStyleGetter}
      />
    </div>
  );
}

export default ProviderCalendar;
