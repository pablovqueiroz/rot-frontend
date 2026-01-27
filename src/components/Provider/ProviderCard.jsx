import "./ProviderCard.css";

function ProviderCard({ provider, onSelect }) {
  const { name, bio, image, services, isActive } = provider;

  const startingPrice =
    services.length > 0
      ? Math.min(...services.map((service) => service.price))
      : null;

  return (
    <div className={`provider-card ${!isActive ? "inactive" : ""}`}>
      <section className="provider-content">
        <article className="provider-info">
          <h4 className="services-title">Services by {name}</h4>

          <ul className="provider-services">
            {services.map((service) => (
              <li
                key={service.id || `${service.name}-${service.price}`}
                className="provider-service"
              >
                {service.name}
              </li>
            ))}
          </ul>
        </article>

        <article className="card-profile-info">
          <img
            src={image?.url}
            alt={name}
            className="provider-avatar"
            loading="lazy"
          />
          <article className="card-profile-info-content">
            <h3 className="provider-name">About {name}</h3>

            {bio && (
              <p className="provider-bio">
                {bio.length > 100 ? bio.slice(0, 100) + "..." : bio}
              </p>
            )}
          </article>
        </article>

        <section className="provider-footer">
          {startingPrice !== null && (
            <span className="service-price">
              <strong>Starting from:</strong> €{startingPrice}
            </span>
          )}

          <button
            className="provider-button"
            disabled={!isActive}
            onClick={() => onSelect(provider)}
          >
            {isActive ? "Book now" : "Not available"}
          </button>
        </section>
      </section>
    </div>
  );
}

export default ProviderCard;
