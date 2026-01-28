import "./Navbar.css";
import { Link, NavLink } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ThemeContext } from "../../context/ThemeContext";
import { API_URL } from "../../config/config";
import axios from "axios";
import Spinner from "../spinner/Spinner";

function Navbar() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { isLoggedIn, currentUser, handleLogout, isLoading } =
    useContext(AuthContext);

  const [displayName, setDisplayName] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  //class to change menu to clicked in mobile screens
  const [menuOpen, setMenuOpen] = useState(false);

  // find user/provider
  useEffect(() => {
    if (!currentUser) return;

    async function fetchProfile() {
      const token = localStorage.getItem("authToken");

      try {
        const endpoint =
          currentUser.role === "provider"
            ? `${API_URL}/providers/me`
            : `${API_URL}/users/me`;

        const { data } = await axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setDisplayName(data.name);
        setProfileImage(data.image?.url || null);
      } catch (error) {
        console.log("FETCH NAVBAR PROFILE ERROR:", error);
        setDisplayName(null);
        setProfileImage(null);
      }
    }

    fetchProfile();
  }, [currentUser]);

  if (isLoading) {
    return <Spinner fullscreen />;
  }

  const profilePath =
    currentUser?.role === "provider" ? "/provider/profile" : "/user/profile";

  return (
    <nav className="nav-container">
      {/* logo */}
      <section className="nav-left">
        <Link to="/">
          <img
            className="nav-logo"
            src="https://res.cloudinary.com/dacvtyyst/image/upload/v1768990617/exql9llxgtwripnqqzli.png"
            alt="rot-logo"
          />
        </Link>
      </section>

      {/* public menu */}
      <section className="nav-center">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/about">About rot</NavLink>
      </section>

      {/* user/prov menu*/}
      <section className="nav-right">
        {/* theme */}
        <label className="ui-switch">
          <input
            type="checkbox"
            checked={theme === "dark"}
            onChange={toggleTheme}
          />
          <div className="slider">
            <div className="circle"></div>
          </div>
        </label>
        {!isLoggedIn && <NavLink to="/login">Login / SignUp</NavLink>}

        {isLoggedIn && (
          <div className="nav-user">
            <button
              className="nav-avatar-button"
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              <img
                className="nav-avatar"
                src={
                  profileImage ||
                  `https://ui-avatars.com/api/?name=${displayName}`
                }
                alt="profile"
              />
            </button>

            {/* menu dropdown*/}
            <div className={`nav-dropdown ${menuOpen ? "open" : ""}`}>
              <p className="nav-dropdown-hello">Hello {displayName}</p>

              <NavLink to={profilePath} onClick={() => setMenuOpen(false)}>
                My Profile
              </NavLink>

              {currentUser?.role === "provider" && (
                <>
                  <NavLink
                    to="/provider/services"
                    onClick={() => setMenuOpen(false)}
                  >
                    My Services
                  </NavLink>

                  <NavLink
                    to="/my-appointments"
                    onClick={() => setMenuOpen(false)}
                  >
                    My Appointments
                  </NavLink>
                </>
              )}

              {currentUser?.role === "user" && (
                <NavLink
                  to="/my-appointments"
                  onClick={() => setMenuOpen(false)}
                >
                  My Appointments
                </NavLink>
              )}

              <button className="nav-logout" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        )}
      </section>
    </nav>
  );
}

export default Navbar;
