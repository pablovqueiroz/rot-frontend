import { useNavigate } from "react-router-dom";
import "./NotFound.css";

export default function NotFound() {
  const navigate = useNavigate();

  function handleGoHome() {
    navigate("/");
  }

  return (
    <div className="notfound-wrapper">
      <div className="notfound-card">
        <h1 className="notfound-code">404</h1>

        <h2 className="notfound-title">
          Page not found
        </h2>

        <p className="notfound-text">
          The page you are trying to access does not exist or was moved.
        </p>

        <button
          className="notfound-button"
          onClick={handleGoHome}
        >
          Go back to Home
        </button>
      </div>
    </div>
  );
}
