function DangerZone({ onDelete, label }) {
  return (
    <section className="danger-zone">
      <h2>Danger Zone</h2>
      <p>
        This action is irreversible. Your account and all related data
        will be permanently deleted.
      </p>

      <button
        type="button"
        className="danger-button"
        onClick={onDelete}
      >
        {label}
      </button>
    </section>
  );
}
export default DangerZone
