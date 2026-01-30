import { useContext, useState } from "react";
import "./Register.css";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../../../config/config";
import axios from "axios";
import Message from "../../../components/Message/Message";
import Spinner from "../../../components/Spinner/Spinner";
import { AuthContext } from "../../../context/AuthContext";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("user");
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const nav = useNavigate();
  const { authenticateUser } = useContext(AuthContext);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    if (!name || !email || !password || !confirmPassword || !image) {
      setErrorMessage("Please fill in all fields and select an image.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("confirmPassword", confirmPassword);
    formData.append("image", image);

    const endpoint =
      role === "provider"
        ? `${API_URL}/api/auth/signup/provider`
        : `${API_URL}/api/auth/signup/user`;

    try {
      const { data } = await axios.post(endpoint, formData);

      localStorage.setItem("authToken", data.authToken);

      await authenticateUser();
      nav("/profile");
      setErrorMessage(null);
    } catch (err) {
      console.log("Register error:", err);
      setErrorMessage(err.response?.data?.errorMessage || "Signup failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isPasswordValid =
    password &&
    confirmPassword &&
    password === confirmPassword &&
    password.length >= 6;

  return (
    <div className="register-wrapper">
      <div className="register-card">
        <h1 className="register-title">Get started!</h1>

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
            <label>Confirm password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat your password..."
            />
            {confirmPassword && password !== confirmPassword && (
              <small className="password-form-hint">
                Passwords do not match
              </small>
            )}
          </section>

          <section className="register-field">
            <label>Profile picture <small>(max 2MB)</small></label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
            {!image && <small className="hint">Image is required</small>}
          </section>

          <Message
            type="error"
            text={errorMessage}
            clearMessage={setErrorMessage}
            duration={4000}
          />

          <div className="register-actions">
            <button
              className={
                isSubmitting ? "register-button hidden" : "register-button"
              }
              disabled={!isPasswordValid}
            >
              {isSubmitting ? "Creating account..." : "Sign up"}
            </button>

            {isSubmitting && <Spinner size={20} text="" />}
          </div>

          <p className="register-footer">
            Already a member? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
