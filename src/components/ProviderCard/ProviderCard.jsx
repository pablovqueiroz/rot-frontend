import "./ProviderCard.css";

function ProviderCard({ provider, onSelect }) {
  const { name, bio, image, services, isActive } = provider;

  const startingPrice =
    services.length > 0
      ? Math.min(...services.map((service) => service.price))
      : null;

  const serviceNames = services
    .slice(0, 3)
    .map((service) => service.name)
    .join(", ");

  const hasMoreServices = services.length > 3;

  return (
    <div className={`provider-card ${!isActive ? "inactive" : ""}`}>
      <div className="provider-avatar-wrapper">
  <img
    src={image?.url}
    alt={name}
    className="provider-avatar"
    loading="lazy"
  />
</div>

      <section className="provider-content">
        <h3 className="provider-name">{name}</h3>

        {bio && (
          <p className="provider-bio">
            {bio.length > 100 ? bio.slice(0, 100) + "..." : bio}
          </p>
        )}

        <article className="provider-info">
          <span className="provider-services">
            {serviceNames}
            {hasMoreServices && "..."}
          </span>

          {startingPrice !== null && <span>From €{startingPrice}</span>}
        </article>

        <button
          className="provider-button"
          disabled={!isActive}
          onClick={() => onSelect(provider)}
        >
          {isActive ? "Book appointment" : "Unavailable"}
        </button>
      </section>
    </div>
  );
}

export default ProviderCard;
