import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config/config";

const AuthContext = createContext();

const AuthWrapper = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const nav = useNavigate();

  //function to authenticate the user via the authToken
  async function authenticateUser() {
    const tokenInStorage = localStorage.getItem("authToken");
    if (!tokenInStorage) {
      setCurrentUser(null);
      setIsLoading(false);
      setIsLoggedIn(false);
      return;
    }
    try {
      const { data } = await axios.get(`${API_URL}/auth/verify`, {
        headers: {
          Authorization: `Bearer ${tokenInStorage}`,
        },
      });
      setCurrentUser(data.decodedToken);
      setIsLoggedIn(true);
      return data.decodedToken;
      
    } catch (error) {
      console.log(error);
      setCurrentUser(null);
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setCurrentUser(null);
    setIsLoggedIn(false);
    nav("/login");
  };

  useEffect(() => {
    authenticateUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoading,
        isLoggedIn,
        authenticateUser,
        handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export { AuthContext, AuthWrapper };
