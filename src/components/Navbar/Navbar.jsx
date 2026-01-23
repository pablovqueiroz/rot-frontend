import { Link, NavLink } from "react-router-dom";
import "./Navbar.css";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

function Navbar() {
  const { isLoggedIn, currentUser, handleLogout, isLoading } =
    useContext(AuthContext);

  if (isLoading) {
    return null;
  }

  let profilePath = "";

  if (isLoggedIn && currentUser) {
    profilePath =
      currentUser.role === "provider" ? "/provider/profile" : "/user/profile";
  }

  return (
    <nav className="nav-container">
      <section className="nav-left">
        <Link to="/">
          <img
            className="nav-logo"
            src="https://res.cloudinary.com/dacvtyyst/image/upload/v1768990617/exql9llxgtwripnqqzli.png"
            alt="rot-logo"
          />
        </Link>
      </section>
      <section className="nav-center">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/appointments">Appointments</NavLink>
        <NavLink to="/about">About</NavLink>
      </section>

      <section className="nav-right">
        {!isLoggedIn && <NavLink to="/login">Login / SignUp</NavLink>}

        {isLoggedIn && (
          <>
            <NavLink to={profilePath}>{currentUser?.name || "Profile"}</NavLink>

            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}

        <label className="ui-switch">
          <input type="checkbox" />
          <div className="slider">
            <div className="circle"></div>
          </div>
        </label>
      </section>
    </nav>
  );
}

export default Navbar;
