import "./profile.css";
import AvatarUploader from "../../components/Profile/AvatarUploader";
import ProfileForm from "../../components/Profile/ProfileForm";
import axios from "axios";
import { API_URL } from "../../config/config";
import DangerZone from "../../components/Profile/DangerZone";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import ProfileHeader from "../../components/Profile/ProfileHeader";

const defaultImg =
  "https://res.cloudinary.com/dacvtyyst/image/upload/v1769168326/bwcwiefeph34flwiwohy.jpg";

function UserProfilePage() {
  const { isLoading, authenticateUser, handleLogout } = useContext(AuthContext);

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

        const { data } = await axios.get(`${API_URL}/users/me`, {
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
        `${API_URL}/users/me`,
        { name, phone },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      await authenticateUser();
      alert("Profile updated successfully");
    } catch (error) {
      console.log(error);
      alert("Failed to delete account.");
    }
  };

  //delete user acount
  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone.",
    );
    if (!confirmed) return;

    const token = localStorage.getItem("authToken");

    try {
      await axios.delete(`${API_URL}/users/me`, {
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

  if (isLoading) {
    return <p>Loading profile...</p>;
  }

  return (
    <main className="profile-page">
      <section className="profile-card">
        <ProfileHeader />

        <div className="profile-form">
          <section className="first-block">
            <AvatarUploader imageUrl={image?.url || defaultImg} role="user" />
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
            <form className="profile-security-form">
              <label>
                Current password
                <input type="password" />
              </label>

              <label>
                New password
                <input type="password" />
              </label>

              <label>
                Confirm new password
                <input type="password" />
              </label>

              <section className="change-password-button">
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

export default UserProfilePage;
