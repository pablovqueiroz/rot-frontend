import { useState } from "react";
import axios from "axios";
import { API_URL } from "../../config/config";
import Message from "../Message/Message";

function ServicesManager({ services = [], onServicesChange }) {
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [openDescription, setOpenDescription] = useState(null);

  const [newService, setNewService] = useState({
    name: "",
    description: "",
    price: "",
    durationMinutes: "",
  });

  const [editingServiceId, setEditingServiceId] = useState(null);

  const [editedService, setEditedService] = useState({
    name: "",
    description: "",
    price: "",
    durationMinutes: "",
  });

  if (!onServicesChange) {
    throw new Error("ServicesManager requires onServicesChange prop");
  }

  //to summarize desccription
  function getDescriptionPreview(text, limit = 50) {
    if (!text) return "";

    if (text.length <= limit) return text;

    return text.slice(0, limit).trim() + "…";
  }

  // ADD service
  const handleAddService = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");
    try {
      const { data } = await axios.post(
        `${API_URL}/api/providers/services`,
        {
          name: newService.name,
          description: newService.description,
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
        description: "",
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
      await axios.delete(`${API_URL}/api/providers/services/${serviceId}`, {
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
        `${API_URL}/api/providers/services/${serviceId}`,
        {
          name: editedService.name,
          description: editedService.description,
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
                  <label>Service</label>
                  <input
                    type="text"
                    value={editedService.name}
                    maxLength={20}
                    onChange={(e) =>
                      setEditedService({
                        ...editedService,
                        name: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="service-col duration">
                  <label>Duration</label>
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
                  <label>Price</label>
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
                <div className="service-col description">
                  <label>Description</label>
                  <textarea
                    value={editedService.description || ""}
                    placeholder="Contact the provider for more information."
                    maxLength={300}
                    rows={1}
                    onFocus={(e) => {
                      e.target.style.height = "auto";
                      e.target.style.height = `${e.target.scrollHeight}px`;
                    }}
                    onChange={(e) => {
                      e.target.style.height = "auto";
                      e.target.style.height = `${e.target.scrollHeight}px`;

                      setEditedService({
                        ...editedService,
                        description: e.target.value,
                      });
                    }}
                    onBlur={(e) => {
                      if (!e.target.value) {
                        e.target.style.height = "34px";
                      }
                    }}
                    required
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
                <div className="service-col name">
                  <strong>Service: </strong> {service.name}
                </div>
                <div className="service-col description">
                  <strong>Description: </strong>
                  {service.description && (
                    <>
                      <span>{getDescriptionPreview(service.description)}</span>

                      {service.description.length > 120 && (
                        <span
                          className="read-more"
                          onClick={() =>
                            setOpenDescription(service.description)
                          }
                        >
                          {" "}
                          read more
                        </span>
                      )}
                    </>
                  )}
                </div>
                <section className="service-card-middle">
                  <div className="service-col duration">
                    <strong>Duration:</strong> {service.durationMinutes}min
                  </div>
                  <div className="service-col price">
                    <strong>Price:</strong> €{service.price}
                  </div>
                </section>

                <div className="service-col actions">
                  <button
                    onClick={() => {
                      setEditingServiceId(service.id);
                      setEditedService({
                        name: service.name,
                        description: service.description ?? "",
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
              placeholder="Service"
              maxLength={20}
              value={newService.name}
              onChange={(e) =>
                setNewService({ ...newService, name: e.target.value })
              }
              required
            />

            <textarea
              value={newService.description}
              placeholder="Service description"
              maxLength={300}
              rows={1}
              onFocus={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
              onChange={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = `${e.target.scrollHeight}px`;

                setNewService({
                  ...newService,
                  description: e.target.value,
                });
              }}
              onBlur={(e) => {
                if (!e.target.value) {
                  e.target.style.height = "34px";
                }
              }}
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
      {/* modal dscription */}
      {openDescription && (
        <div className="modal-overlay" onClick={() => setOpenDescription(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Service description</h3>

            <p>{openDescription}</p>

            <button onClick={() => setOpenDescription(null)}>Close</button>
          </div>
        </div>
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
  );
}

export default ServicesManager;
