import { useState } from "react";
import "./Register.css";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../../../config/config";
import axios from "axios";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const nav = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!name || !email || !password || !image) {
      setErrorMessage("Please fill in all fields and select an image.");
      return;
    }
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("image", image);

    const endpoint =
      role === "provider"
        ? `${API_URL}/auth/signup/provider`
        : `${API_URL}/auth/signup/user`;

    try {
      await axios.post(endpoint, formData);
      nav("/login");
    } catch (err) {
      console.log(err);
      setErrorMessage(err.response?.data?.errorMessage || "Signup failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-card">
        <h3 className="register-title">Create your account</h3>

        <form className="register-form" onSubmit={handleRegister}>
          <section className="role-selector">
            <button
              type="button"
              className={role === "user" ? "active" : ""}
              onClick={() => setRole("user")}
            >
              Client
            </button>

            <button
              type="button"
              className={role === "provider" ? "active" : ""}
              onClick={() => setRole("provider")}
            >
              Provider
            </button>
          </section>
          <section className="register-field">
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name..."
            />
          </section>

          <section className="register-field">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email..."
            />
          </section>

          <section className="register-field">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password..."
            />
          </section>

          <section className="register-field">
            <label>Profile picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
            {!image && <small className="hint">Image is required</small>}
          </section>

          {errorMessage && <p className="register-error">{errorMessage}</p>}

          <button className="register-button" disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Sign up"}
          </button>

          <p className="register-footer">
            Already a member? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
