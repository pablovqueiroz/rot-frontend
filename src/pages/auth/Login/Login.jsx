import "./Login.css";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import axios from "axios";
import { API_URL } from "../../../config/config";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { authenticateUser } = useContext(AuthContext);
   const nav = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    try {
      const { data } = await axios.post(`${API_URL}/auth/login`, {
        password,
        email,
      });
      // console.log(data);
      //store the authToken in local storage
      localStorage.setItem("authToken", data.authToken);
      const userData = await authenticateUser();
      if (userData.role === "provider") {
        nav("/provider/profile");
      } else {
        nav("/user/profile");
      }
    } catch (err) {
      console.log(err);
      setErrorMessage(
        err.response?.data?.errorMessage || "Something went wrong",
      );
    }
  };

  return (
    <div className="login-wrapper">
      <section className="login-card">
        <h3 className="login-title">Welcome back!</h3>

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

          {errorMessage && <p className="login-error">{errorMessage}</p>}
          
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
