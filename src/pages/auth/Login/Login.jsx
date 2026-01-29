import "./Login.css";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import axios from "axios";
import { API_URL } from "../../../config/config";
import Message from "../../../components/Message/Message";
import Spinner from "../../../components/Spinner/Spinner";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const { authenticateUser } = useContext(AuthContext);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nav = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data } = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
      });

      localStorage.setItem("authToken", data.authToken);

      await authenticateUser();
      nav("/profile");

      setErrorMessage(null);
    } catch (err) {
      setErrorMessage(
        err.response?.data?.errorMessage || "Something went wrong",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-wrapper">
      <section className="login-card">
        <h1 className="login-title">Welcome!</h1>

        <form className="login-form" onSubmit={handleLogin}>
          <article className="login-field">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email..."
            />
          </article>

          <article className="login-field">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password..."
            />
          </article>

          <Message
            type="error"
            text={errorMessage}
            clearMessage={setErrorMessage}
            duration={4000}
          />

          <div className="login-actions">
            <button
              className={isSubmitting ? "login-button hidden" : "login-button"}
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>

            {isSubmitting && <Spinner size={20} text="" />}
          </div>

          <p className="login-footer">
            New here? <Link to="/register">Sign up</Link>
          </p>
        </form>
      </section>
    </div>
  );
}
export default Login;
