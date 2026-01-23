function ProfileForm({ children, onSubmit, submitLabel }) {
  return (
    <form className="profile-form" onSubmit={onSubmit}>
      {children}
      <button type="submit">
        {submitLabel || "Save Changes"}
      </button>
    </form>
  );
}

export default ProfileForm;