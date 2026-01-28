import "./HomePage.css";
import Hero from "../../components/Dashboard/Hero";
import ProvidersList from "../provider/ProvidersList/ProvidersList";
import SearchHeader from "../../components/SearchHeader/SearchHeader";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../config/config";
import Message from "../../components/Message/Message";

function HomePage() {
  const [providers, setProviders] = useState([]);
  const [search, setSearch] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);
  const [errorMessage, setErrorMessage] = useState(null);
  const [selectedService, setSelectedService] = useState("all");

  //fetch providers
  useEffect(() => {
    async function fetchProviders() {
      try {
        const response = await axios.get(`${API_URL}/providers`);
        setProviders(response.data);
        setErrorMessage(null);
      } catch (error) {
        console.error("Failed to load providers:", error);
        setErrorMessage("Failed to load providers. Please try again.");
      }
    }

    fetchProviders();
  }, []);

  //get services name by alphabetic order to use filter
  const availableServices = [
    "all",
    ...Array.from(
      new Set(
        providers.flatMap((provider) =>
          provider.services.map((service) => service.name),
        ),
      ),
    ).sort((a, b) => a.localeCompare(b)),
  ];

  //searchbar
  const searchFilteredProviders = providers.filter(
    (provider) =>
      provider.name.toLowerCase().includes(search.toLowerCase()) ||
      provider.services.some((service) =>
        service.name.toLowerCase().includes(search.toLowerCase()),
      ),
  );

  //service filter
  const serviceFilteredProviders = searchFilteredProviders.filter(
    (provider) => {
      if (selectedService === "all") return true;

      return provider.services.some(
        (service) => service.name === selectedService,
      );
    },
  );

  //pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const totalPages = Math.ceil(serviceFilteredProviders.length / itemsPerPage);

  const providersToShow = serviceFilteredProviders.slice(startIndex, endIndex);

  return (
    <div className="home-content">
      <Hero />
      <section className="filter-section">
        <SearchHeader
          onSearch={(value) => {
            setSearch(value);
            setCurrentPage(1);
          }}
        />

        <div className="service-filter">
          <label htmlFor="service-select">Filter by service</label>

          <select
            id="service-select"
            value={selectedService}
            onChange={(e) => {
              setSelectedService(e.target.value);
              setCurrentPage(1);
            }}
          >
            {availableServices.map((service) => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
          </select>
        </div>
      </section>

      <Message
        type="error"
        text={errorMessage}
        clearMessage={setErrorMessage}
        duration={4000}
      />

      <div className="top-pagination">
        {totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              ⬅
            </button>

            <span>
              {currentPage} / {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              ➡
            </button>
          </div>
        )}
      </div>

      <ProvidersList providers={providersToShow} />

      <div className="bottom-pagination">
        {totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              ⬅
            </button>

            <span>
              {currentPage} / {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              ➡
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;
