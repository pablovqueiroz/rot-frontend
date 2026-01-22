
function useCalendarEvents(appointments = []) {
  return appointments.map((appointment) => {
    const dateOnly = appointment.date.split("T")[0];

    const start = new Date(`${dateOnly}T${appointment.startTime}`);
    const end = new Date(`${dateOnly}T${appointment.endTime}`);

    return {
      id: appointment._id,
      title: appointment.service.name,
      start,
      end,

      status: appointment.status,
      provider: appointment.provider,
      client: appointment.client,
      raw: appointment,
    };
  });
}

export default useCalendarEvents;
