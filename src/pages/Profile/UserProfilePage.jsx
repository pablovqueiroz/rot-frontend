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
        console.error(error);
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
      console.error(error);
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
      console.error(error);
      alert("Failed to delete account.");
    }
  };

  if (isLoading) {
    return <p>Loading profile...</p>;
  }

  return (
    <main className="profile-page">
      <ProfileHeader />

      <section className="profile-card">
        <AvatarUploader imageUrl={image?.url || defaultImg} role="user" />
        <div className="profile-form">
          <h1>My Profile</h1>

          <ProfileForm onSubmit={handleUpdateProfile}>
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
              Email
              <input type="email" value={email} disabled />
            </label>
          </ProfileForm>

          <hr className="profile-divider" />

          <section className="profile-security">
            <h2>Security</h2>

            <form>
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

              <button type="submit">Change password</button>
            </form>
          </section>
          <DangerZone
            label="Delete my account"
            onDelete={handleDeleteAccount}
          />
        </div>
      </section>
    </main>
  );
}

export default UserProfilePage;
