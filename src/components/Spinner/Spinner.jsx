import BounceLoader from "react-spinners/BounceLoader";
import "./Spinner.css";

function Spinner({
  fullscreen = false,
  size = 40,
  text = "Loading..."
}) {
  return (
    <div className={fullscreen ? "spinner-overlay" : "spinner-container"}>
      <div className="spinner-content">
        <BounceLoader
          size={size}
          color="var(--color-primary)"
          aria-label="Loading Spinner"
        />
        <p className="spinner-text">{text}</p>
      </div>
    </div>
  );
}

export default Spinner;
