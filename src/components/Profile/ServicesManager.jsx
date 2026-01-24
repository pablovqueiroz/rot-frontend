import { useState } from "react";
import axios from "axios";
import { API_URL } from "../../config/config";

function ServicesManager({ services, onServicesChange }) {
  const [newService, setNewService] = useState({
    name: "",
    price: "",
    durationMinutes: "",
  });

  // ADD service
  const handleAddService = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");

    try {
      const { data } = await axios.post(
        `${API_URL}/providers/services`,
        {
          name: newService.name,
          price: Number(newService.price),
          durationMinutes: Number(newService.durationMinutes),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      onServicesChange(data);

      setNewService({
        name: "",
        price: "",
        durationMinutes: "",
      });
    } catch (error) {
      console.log(error);
      alert("Failed to add service");
    }
  };

  // DELETE service
  const handleDeleteService = async (serviceId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this service?",
    );

    if (!confirmed) return;

    const token = localStorage.getItem("authToken");

    try {
      await axios.delete(`${API_URL}/providers/services/${serviceId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      onServicesChange(services.filter((service) => service.id !== serviceId));
    } catch (error) {
      console.log(error);
      alert("Failed to delete service");
    }
  };

  return (
    <section className="services-manager">
      <h2>My Services</h2>

      <ul className="services-list">
        {services.length === 0 && <p>No services added yet.</p>}

        {services.map((service) => (
          <li key={service.id} className="service-item">
            <strong>{service.name}</strong>
            <span>{service.durationMinutes} min</span>
            <span>€ {service.price}</span>

            <button
              type="button"
              onClick={() => handleDeleteService(service.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      <form onSubmit={handleAddService} className="service-form">
        <input
          type="text"
          placeholder="Service name"
          value={newService.name}
          onChange={(e) =>
            setNewService({ ...newService, name: e.target.value })
          }
          required
        />

        <input
          type="number"
          placeholder="Price"
          value={newService.price}
          onChange={(e) =>
            setNewService({ ...newService, price: e.target.value })
          }
          required
        />

        <input
          type="number"
          placeholder="Duration (minutes)"
          value={newService.durationMinutes}
          onChange={(e) =>
            setNewService({
              ...newService,
              durationMinutes: e.target.value,
            })
          }
          required
        />

        <button type="submit">Add Service</button>
      </form>
    </section>
  );
}

export default ServicesManager;
