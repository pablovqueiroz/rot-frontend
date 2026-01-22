const API_URL = "http://localhost:5005/api";

export async function getAppointments() {
  const token = localStorage.getItem("authToken");

  const response = await fetch(`${API_URL}/appointments`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch appointments");
  }

  return response.json();
}
