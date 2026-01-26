function ProfileForm({ children, onSubmit, submitLabel }) {
  return (
    <form className="profile-form" onSubmit={onSubmit}>
      {children}
      
      <section className="save-button">
      <button type="submit">
        {submitLabel || "Save Changes"}
      </button>
      </section>
    </form>
  );
}

export default ProfileForm;