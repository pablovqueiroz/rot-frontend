import "./Login.css";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import axios from "axios";
import { API_URL } from "../../../config/config";
import Message from "../../../components/Message/Message";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const { authenticateUser } = useContext(AuthContext);
  const nav = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${API_URL}/auth/login`, {
        password,
        email,
      });

      //store the authToken in local storage
      localStorage.setItem("authToken", data.authToken);
      const userData = await authenticateUser();
      if (userData.role === "provider") {
        nav("/provider/profile");
      } else {
        nav("/user/profile");
      }
      setErrorMessage(null);
    } catch (err) {
      console.log("Login error:", err);
      setErrorMessage(
        err.response?.data?.errorMessage || "Something went wrong",
      );
    }
  };

  return (
    <div className="login-wrapper">
      <section className="login-card">
        <h3 className="login-title">Welcome!</h3>

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

          <button className="login-button">Login</button>

          <p className="login-footer">
            New here? <Link to="/register">Sign up</Link>
          </p>
        </form>
      </section>
    </div>
  );
}
export default Login;
