import axios from "axios";
import { useEffect, useState } from "react";
import { API_URL } from "../../config/config";

function AvailabilitySection() {
  const [availability, setAvailability] = useState([
    { dayOfWeek: 1, enabled: false, startTime: "09:00", endTime: "18:00" },
    { dayOfWeek: 2, enabled: false, startTime: "09:00", endTime: "18:00" },
    { dayOfWeek: 3, enabled: false, startTime: "09:00", endTime: "18:00" },
    { dayOfWeek: 4, enabled: false, startTime: "09:00", endTime: "18:00" },
    { dayOfWeek: 5, enabled: false, startTime: "09:00", endTime: "18:00" },
    { dayOfWeek: 6, enabled: false, startTime: "09:00", endTime: "18:00" },
    { dayOfWeek: 0, enabled: false, startTime: "09:00", endTime: "18:00" },
  ]);

  const getDayName = (dayOfWeek) => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days[dayOfWeek];
  };

  const availabilityForBackend = availability
    .filter((day) => day.enabled)
    .map(({ dayOfWeek, startTime, endTime }) => ({
      dayOfWeek,
      startTime,
      endTime,
    }));

  useEffect(() => {
    async function fetchAvailability() {
      const token = localStorage.getItem("authToken");
      const { data } = await axios.get(`${API_URL}/providers/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!data.availability) return;

      setAvailability((prev) =>
        prev.map((day) => {
          const saved = data.availability.find(
            (a) => a.dayOfWeek === day.dayOfWeek,
          );
          return saved
            ? {
                ...day,
                enabled: true,
                startTime: saved.startTime,
                endTime: saved.endTime,
              }
            : day;
        }),
      );
    }

    fetchAvailability();
  }, []);

  const handleSaveAvailability = async () => {
    const token = localStorage.getItem("authToken");
    try {
      await axios.put(
        `${API_URL}/providers/me`,
        { availability: availabilityForBackend },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      alert("Availability saved");
    } catch (err) {
      console.log(err);
      alert("Failed to save availability");
    }
  };

  return (
    <>
      <h2 className="profile-section-title">Availability</h2>

      <div className="availability-manager">
        {availability.map((day) => (
          <div key={day.dayOfWeek} className="availability-item">
            <label className="availability-day">
              <input
                type="checkbox"
                checked={day.enabled}
                onChange={() =>
                  setAvailability((prev) =>
                    prev.map((d) =>
                      d.dayOfWeek === day.dayOfWeek
                        ? { ...d, enabled: !d.enabled }
                        : d,
                    ),
                  )
                }
              />
              {getDayName(day.dayOfWeek)}
            </label>

            <div className="availability-hours">
              <input
                type="time"
                value={day.startTime}
                disabled={!day.enabled}
                onChange={(e) =>
                  setAvailability((prev) =>
                    prev.map((d) =>
                      d.dayOfWeek === day.dayOfWeek
                        ? { ...d, startTime: e.target.value }
                        : d,
                    ),
                  )
                }
              />
              <span>–</span>
              <input
                type="time"
                value={day.endTime}
                disabled={!day.enabled}
                onChange={(e) =>
                  setAvailability((prev) =>
                    prev.map((d) =>
                      d.dayOfWeek === day.dayOfWeek
                        ? { ...d, endTime: e.target.value }
                        : d,
                    ),
                  )
                }
              />
            </div>
          </div>
        ))}
      </div>

      <button onClick={handleSaveAvailability}>Save availability</button>
    </>
  );
}

export default AvailabilitySection;
