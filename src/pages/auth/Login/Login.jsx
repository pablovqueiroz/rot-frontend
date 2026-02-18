import "./Login.css";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
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
  const [isOAuthConfirmOpen, setIsOAuthConfirmOpen] = useState(false);

  const nav = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const oauthToken = params.get("authToken") || params.get("token");
    const oauthError = params.get("error") || params.get("oauthError");
    const clearOAuthParamsFromUrl = () => {
      window.history.replaceState({}, document.title, window.location.pathname);
    };

    if (oauthError) {
      setErrorMessage("OAuth login failed. Please try again.");
      clearOAuthParamsFromUrl();
      return;
    }

    if (!oauthToken) return;

    const finishOAuthLogin = async () => {
      setIsSubmitting(true);
      try {
        localStorage.setItem("authToken", oauthToken);
        await authenticateUser();
        clearOAuthParamsFromUrl();
        nav("/profile");
      } catch (err) {
        setErrorMessage(
          err.response?.data?.errorMessage ||
            "OAuth login failed. Please try again.",
        );
      } finally {
        setIsSubmitting(false);
      }
    };

    finishOAuthLogin();
  }, [authenticateUser, nav]);

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

  const [oauthRole, setOauthRole] = useState("user");

  const handleGoogleLogin = () => {
    setIsOAuthConfirmOpen(true);
  };

  const confirmGoogleLogin = () => {
    setErrorMessage(null);
    setIsSubmitting(true);
    setIsOAuthConfirmOpen(false);
    window.location.assign(`${API_URL}/api/auth/google?role=${oauthRole}`);
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

          <section className="role-selector">
            <button
              type="button"
              className={oauthRole === "user" ? "active" : ""}
              onClick={() => setOauthRole("user")}
            >
              Client
            </button>
            <button
              type="button"
              className={oauthRole === "provider" ? "active" : ""}
              onClick={() => setOauthRole("provider")}
            >
              Provider
            </button>
          </section>

          <button
            type="button"
            className="oauth-button"
            onClick={handleGoogleLogin}
            disabled={isSubmitting}
          >
            <FcGoogle className="oauth-google-icon" aria-hidden="true" />
            Continue with Google
          </button>

          {isOAuthConfirmOpen && (
            <section className="oauth-confirm">
              <p>
                Continue with Google as{" "}
                <strong>{oauthRole === "provider" ? "Provider" : "Client"}</strong>
                ?
              </p>
              <div className="oauth-confirm-actions">
                <button
                  type="button"
                  onClick={() => setIsOAuthConfirmOpen(false)}
                >
                  Cancel
                </button>
                <button type="button" onClick={confirmGoogleLogin}>
                  Continue
                </button>
              </div>
            </section>
          )}

          <p className="login-footer">
            New here? <Link to="/register">Sign up</Link>
          </p>
        </form>
      </section>
    </div>
  );
}
export default Login;
