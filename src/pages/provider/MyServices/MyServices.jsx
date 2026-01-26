import "./MyServices.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../../config/config";
import ServicesManager from "../../../components/Provider/ServicesManager";
import AvailabilitySection from "../../../components/Provider/AvailabilitySection";

function MyServices() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      const token = localStorage.getItem("authToken");

      const { data } = await axios.get(`${API_URL}/providers/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setServices(data.services || []);
    };

    fetchServices();
  }, []);

  return (
    <main className="my-services-page">
      <section className="availability-card">
        <header className="my-services-header">
          <h1>Availability</h1>
          <p>Manage your availability</p>
        </header>
        <AvailabilitySection />
      </section>
      <section className="my-services-card">
        <header className="my-services-header">
          <h1>My Services</h1>
          <p>Manage your services</p>
        </header>

        <ServicesManager services={services} onServicesChange={setServices} />
      </section>
    </main>
  );
}

export default MyServices;
