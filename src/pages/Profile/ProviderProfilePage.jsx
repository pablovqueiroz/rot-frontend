import "./profile.css";
import AvatarUploader from "../../components/Profile/AvatarUploader";
import ProfileForm from "../../components/Profile/ProfileForm";
import ProfileHeader from "../../components/profile/ProfileHeader";
import axios from "axios";
import { API_URL } from "../../config/config";
import DangerZone from "../../components/Profile/DangerZone";
import { AuthContext } from "../../context/AuthContext";
import { useContext, useEffect, useState } from "react";
import ServicesManager from "../../components/Profile/ServicesManager";
import AvailabilitySection from "../../components/Profile/AvailabilitySection";

const defaultImg =
  "https://res.cloudinary.com/dacvtyyst/image/upload/v1769168326/bwcwiefeph34flwiwohy.jpg";

function ProviderProfilePage() {
  const { isLoading, authenticateUser, handleLogout } = useContext(AuthContext);
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
      alert("Profile updated successfully");
    } catch (error) {
      console.log(error);
      alert("Failed to update profile.");
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
        <AvatarUploader
          imageUrl={image?.url || defaultImg}
          role="provider"
          onImageUpdated={handleImageUpdated}
        />

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
              Bio
              <textarea
                rows="4"
                value={bio}
                onChange={(e) =>
                  setProfile({ ...profile, bio: e.target.value })
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
            </form>
            <hr className="profile-divider" />

            <ServicesManager
              services={profile.services}
              onServicesChange={(updatedServices) =>
                setProfile((prev) => ({ ...prev, services: updatedServices }))
              }
            />
          </section>
          <AvailabilitySection />
          <DangerZone
            label="Delete my account"
            onDelete={handleDeleteAccount}
          />
        </div>
      </section>
    </main>
  );
}

export default ProviderProfilePage;
