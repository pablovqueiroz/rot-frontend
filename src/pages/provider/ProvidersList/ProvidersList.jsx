import "./ProvidersList.css";
import { useNavigate } from "react-router-dom";
import ProviderCard from "../../../components/Provider/ProviderCard";

function ProvidersList({ providers }) {
  const navigate = useNavigate();

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
