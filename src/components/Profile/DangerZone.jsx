function DangerZone({ onDelete, label }) {
  return (
    <div className="danger-container">

    <section className="danger-zone">
      <h2>Danger Zone</h2>
      <p>
        This action is irreversible. Your account and all related data will be
        permanently deleted.
      </p>

      <section className="delete-account-button">
        <button type="button" className="danger-button" onClick={onDelete}>
          {label}
        </button>
      </section>
    </section>
    </div>
  );
}
export default DangerZone;
