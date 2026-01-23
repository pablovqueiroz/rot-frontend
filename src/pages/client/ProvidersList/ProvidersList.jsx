import { useEffect, useState } from "react";
import "./ProvidersList.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ProviderCard from "../../../components/ProviderCard/ProviderCard";
import { API_URL } from "../../../../../../../module-2/week 2/MD2 - PROJECT/harry-potter-react-app/src/config/config";

function ProvidersList() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_URL}/providers`)
      .then(({ data }) => {
        console.log("providers dadta: ", data);
        setProviders(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.log("Error fetching providers data", err);
      })
      .finally(() => {
        setLoading(false);
      });
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
