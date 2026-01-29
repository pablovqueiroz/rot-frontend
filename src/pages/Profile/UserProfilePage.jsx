import "./ProfilePage.css";
import AvatarUploader from "../../components/Profile/AvatarUploader";
import ProfileForm from "../../components/Profile/ProfileForm";
import axios from "axios";
import { API_URL } from "../../config/config";
import DangerZone from "../../components/Profile/DangerZone";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import ProfileHeader from "../../components/Profile/ProfileHeader";
import Message from "../../components/Message/Message";
import Spinner from "../../components/Spinner/Spinner";

const defaultImg =
  "https://res.cloudinary.com/dacvtyyst/image/upload/v1769168326/bwcwiefeph34flwiwohy.jpg";

function UserProfilePage() {
  const { isLoading, authenticateUser, handleLogout } = useContext(AuthContext);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [profile, setProfile] = useState({
    name: "",
    phone: "",
    email: "",
    image: null,
  });
  const { name, phone, email, image } = profile;

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("authToken");

        const { data } = await axios.get(`${API_URL}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProfile({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          image: data.image || null,
        });
      } catch (error) {
        console.log(error);
      }
    };

    fetchUserProfile();
  }, []);

  //update user account
  const handleUpdateProfile = async () => {
    const token = localStorage.getItem("authToken");

    try {
      await axios.put(
        `${API_URL}/api/users/me`,
        { name, phone },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      await authenticateUser();
      setSuccessMessage("Profile updated successfully.");
      setErrorMessage(null);
    } catch (error) {
      console.log(error);
      setErrorMessage("Failed to update profile.");
    }
  };

  //update image
  const handleImageUpdated = (newImage) => {
    setProfile((prev) => ({
      ...prev,
      image: newImage,
    }));
  };

  //delete user acount
  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone.",
    );
    if (!confirmed) return;

    const token = localStorage.getItem("authToken");

    try {
      await axios.delete(`${API_URL}/api/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      handleLogout();
    } catch (error) {
      console.log(error);
      alert("Failed to delete account.");
    }
  };

  //to match password changing
  function isPasswordFormValid(form) {
    if (!form.currentPassword) return false;
    if (!form.newPassword) return false;
    if (!form.confirmNewPassword) return false;

    if (form.newPassword !== form.confirmNewPassword) return false;

    if (form.newPassword.length < 6) return false;

    return true;
  }

  const isFormValid = isPasswordFormValid(passwordForm);

  //change password
  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!isPasswordFormValid(passwordForm)) {
      setErrorMessage("Please fill all fields correctly.");
      return;
    }

    const token = localStorage.getItem("authToken");
    setIsChangingPassword(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const { data } = await axios.put(
        `${API_URL}/api/auth/change-password`,
        passwordForm,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setSuccessMessage(data.message);
      setErrorMessage(null);

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (error) {
      console.log(error);
      setErrorMessage("Failed to change password.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (isLoading) {
    return <Spinner fullscreen text="Loading profile..." />;
  }

  return (
    <main className="profile-page">
      <section className="profile-card">
        <ProfileHeader />

        <div className="profile-form">
          <section className="first-block">
            <AvatarUploader
              imageUrl={image?.url || defaultImg}
              role="user"
              onImageUpdated={handleImageUpdated}
            />
            <ProfileForm onSubmit={handleUpdateProfile}>
              <label>
                Email
                <input type="email" value={email} disabled />
              </label>

              <label>
                Name
                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.target.value })
                  }
                />
              </label>

              <label>
                Phone
                <input
                  type="text"
                  value={phone}
                  onChange={(e) =>
                    setProfile({ ...profile, phone: e.target.value })
                  }
                />
              </label>
            </ProfileForm>
          </section>
          <hr className="profile-divider" />

          <section className="security-header">
            <h2>Security</h2>
          </section>
          <section className="profile-security">
            <form
              className="profile-security-form"
              onSubmit={handleChangePassword}
            >
              <label>
                Current password
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      currentPassword: e.target.value,
                    })
                  }
                />
              </label>

              <label>
                New password
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      newPassword: e.target.value,
                    })
                  }
                />
              </label>

              <label>
                Confirm new password
                <input
                  type="password"
                  value={passwordForm.confirmNewPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      confirmNewPassword: e.target.value,
                    })
                  }
                />
                {passwordForm.confirmNewPassword &&
                  passwordForm.newPassword !==
                    passwordForm.confirmNewPassword && (
                    <small className="password-form-hint">
                      Passwords do not match
                    </small>
                  )}
              </label>

              <section className="change-password-button">
                <Message
                  type="success"
                  text={successMessage}
                  clearMessage={setSuccessMessage}
                />

                <Message
                  type="error"
                  text={errorMessage}
                  clearMessage={setErrorMessage}
                  duration={4000}
                />
                {isChangingPassword && (
                  <Spinner
                    size={16}
                    text="Changing..."
                    color="var(--color-primary)"
                  />
                )}
                <button
                  type="submit"
                  className={isChangingPassword ? "hidden" : ""}
                  disabled={!isFormValid}
                >
                  Change password
                </button>
              </section>
            </form>
            <DangerZone
              label="Delete my account"
              onDelete={handleDeleteAccount}
            />
          </section>
        </div>
      </section>
    </main>
  );
}

export default UserProfilePage;
