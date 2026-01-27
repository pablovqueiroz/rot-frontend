import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../config/config";
import Message from "../Message/Message";

function ServicesManager({ services = [], onServicesChange }) {
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const [newService, setNewService] = useState({
    name: "",
    price: "",
    durationMinutes: "",
  });

  const [editingServiceId, setEditingServiceId] = useState(null);

  const [editedService, setEditedService] = useState({
    name: "",
    price: "",
    durationMinutes: "",
  });

  if (!onServicesChange) {
    throw new Error("ServicesManager requires onServicesChange prop");
  }

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

      setSuccessMessage("Service added successfully.");
      setErrorMessage(null);
    } catch (error) {
      console.log("Failed to add service.", error);
      setErrorMessage("Failed to add service.");
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
      setErrorMessage(null);
      setSuccessMessage("Service deleted successfully.");
    } catch (error) {
      console.log(error);
      setErrorMessage("Failed to delete service.");
    }
  };

  //update service
  const handleUpdateService = async (serviceId) => {
    const token = localStorage.getItem("authToken");

    try {
      const { data } = await axios.put(
        `${API_URL}/providers/services/${serviceId}`,
        {
          name: editedService.name,
          price: Number(editedService.price),
          durationMinutes: Number(editedService.durationMinutes),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const updatedServices = services.map((service) =>
        service.id === serviceId ? data : service,
      );

      onServicesChange(updatedServices);
      setEditingServiceId(null);
      setSuccessMessage("Service updated successfully.");
      setErrorMessage(null);
    } catch (error) {
      console.log(error);
      setErrorMessage("Failed to update service.");
    }
  };

  return (
    <section className="services-manager">
      <ul className="services-list">
        {services.length === 0 && !editingServiceId && (
          <p>No services added yet.</p>
        )}

        {services.map((service) => (
          <li key={service.id} className="service-item">
            {editingServiceId === service.id ? (
              <>
                <div className="service-col name">
                  <input
                    type="text"
                    value={editedService.name}
                    onChange={(e) =>
                      setEditedService({
                        ...editedService,
                        name: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="service-col duration">
                  <input
                    type="number"
                    value={editedService.durationMinutes}
                    onChange={(e) =>
                      setEditedService({
                        ...editedService,
                        durationMinutes: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="service-col price">
                  <input
                    type="number"
                    value={editedService.price}
                    onChange={(e) =>
                      setEditedService({
                        ...editedService,
                        price: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="service-col actions">
                  <button onClick={() => handleUpdateService(service.id)}>
                    Save
                  </button>
                  <button onClick={() => setEditingServiceId(null)}>
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="service-col name">{service.name}</div>
                <div className="service-col duration">
                  {service.durationMinutes} min
                </div>
                <div className="service-col price">€{service.price}</div>

                <div className="service-col actions">
                  <button
                    onClick={() => {
                      setEditingServiceId(service.id);
                      setEditedService({
                        name: service.name,
                        price: service.price,
                        durationMinutes: service.durationMinutes,
                      });
                    }}
                  >
                    Edit
                  </button>
                  <button onClick={() => handleDeleteService(service.id)}>
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>

      <section className="form-container">
        <form onSubmit={handleAddService} className="service-form">
          <div className="service-form-inputs">
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
          </div>
          <div className="service-form-actions">
            <button type="submit">Add Service</button>
          </div>
        </form>
      </section>

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
  );
}

export default ServicesManager;
