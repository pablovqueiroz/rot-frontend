import "./profile.css";
import AvatarUploader from "../../components/Profile/AvatarUploader";
import ProfileForm from "../../components/Profile/ProfileForm";
import axios from "axios";
import { API_URL } from "../../config/config";
import DangerZone from "../../components/Profile/DangerZone";
import { AuthContext } from "../../context/AuthContext";
import { useContext, useEffect, useState } from "react";
import ProfileHeader from "../../components/Profile/ProfileHeader";
import Message from "../../components/Message/Message";
import Spinner from "../../components/spinner/Spinner";

const defaultImg =
  "https://res.cloudinary.com/dacvtyyst/image/upload/v1769168326/bwcwiefeph34flwiwohy.jpg";

function ProviderProfilePage() {
  const { isLoading, authenticateUser, handleLogout } = useContext(AuthContext);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    image: null,
    services: [],
  });

  const { name, email, phone, bio, image } = profile;

  useEffect(() => {
    const fetchProviderProfile = async () => {
      try {
        const token = localStorage.getItem("authToken");

        const { data } = await axios.get(`${API_URL}/providers/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProfile({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          bio: data.bio || "",
          image: data.image || null,
          services: data.services || [],
        });
      } catch (error) {
        console.log(error);
      }
    };

    fetchProviderProfile();
  }, []);

  //update provider account
  const handleUpdateProfile = async () => {
    const token = localStorage.getItem("authToken");
    try {
      await axios.put(
        `${API_URL}/providers/me`,
        { name, phone, bio },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      await authenticateUser();
      setSuccessMessage("Profile updated successfully.");
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

  //delete provider account
  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone.",
    );

    if (!confirmed) return;

    const token = localStorage.getItem("authToken");

    try {
      await axios.delete(`${API_URL}/providers/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      handleLogout();
    } catch (error) {
      console.log(error);
      setErrorMessage("Failed to delete account.");
    }
  };

  if (isLoading) {
    return <Spinner fullscreen text="Loading profile..."/>;
  }

  //update password
  const handleChangePassword = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("authToken");

    try {
      const { data } = await axios.put(
        `${API_URL}/auth/change-password`,
        passwordForm,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
      setSuccessMessage(data.message);
      setErrorMessage(null);
    } catch (error) {
      console.log(error)
      setErrorMessage(
        error.response?.data?.message || "Failed to change password.",
      );
    }
  };

  return (
    <main className="profile-page">
      <section className="profile-card">
        <ProfileHeader />

        <div className="profile-form">
          <section className="first-block">
            <AvatarUploader
              imageUrl={image?.url || defaultImg}
              role="provider"
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

              <label>
                Bio
                <textarea
                  rows="4"
                  value={bio}
                  onChange={(e) =>
                    setProfile({ ...profile, bio: e.target.value })
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

                <button type="submit">Change password</button>
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

export default ProviderProfilePage;
