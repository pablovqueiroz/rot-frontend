import "./HomePage.css";
import Hero from "../../components/Dashboard/Hero";
import ProvidersList from "../provider/ProvidersList/ProvidersList";
import SearchHeader from "../../components/SearchHeader/SearchHeader";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../config/config";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const [providers, setProviders] = useState([]);
  const [search, setSearch] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  //fetch providers
  useEffect(() => {
    async function fetchProviders() {
      try {
        const response = await axios.get(`${API_URL}/providers`);
        setProviders(response.data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchProviders();
  }, []);

  //searchbar
  const filteredProviders = providers.filter(
    (provider) =>
      provider.name.toLowerCase().includes(search.toLowerCase()) ||
      provider.services.some((service) =>
        service.name.toLowerCase().includes(search.toLowerCase()),
      ),
  );

  //pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const totalPages = Math.ceil(filteredProviders.length / itemsPerPage);

  const providersToShow = filteredProviders.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  return (
    <div className="home-content">
      <Hero />

      <SearchHeader onSearch={setSearch} />

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
