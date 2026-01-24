import { useEffect, useState } from "react";
import "./ProvidersList.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ProviderCard from "../../../components/ProviderCard/ProviderCard";
import { API_URL } from "../../../config/config";

function ProvidersList() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
  async function fetchProviders() {
    try {
      const { data } = await axios.get(`${API_URL}/providers`);
      setProviders(data || []);
    } catch (err) {
      console.log("Error fetching providers data", err);
    } finally {
      setLoading(false);
    }
  }

  fetchProviders();
}, []);

  const handleSelectProvider = (providerId) => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      navigate("/login");
      return;
    }

    navigate(`/providers/${providerId}`);
  };

  return (
    <div className="providers-list">
      {providers.map((provider) => (
        <ProviderCard
          key={provider._id}
          provider={provider}
          onSelect={() => handleSelectProvider(provider._id)}
        />
      ))}
    </div>
  );
}
export default ProvidersList;
