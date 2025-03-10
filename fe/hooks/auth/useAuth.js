import { useState } from "react";
import axios from "axios";


const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post("http://localhost:3000/auth/login", {
        email,
        password,
      });

      const userData = response.data;
      setUser(userData);
      localStorage.setItem("token", userData.token); // Save token for persistence

      return userData; // Can be used for additional logic
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      console.log(err)
      return null;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (username, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post("http://localhost:3000/auth/register", {
        username,
        email,
        password,
      });

      const userData = response.data;
      setUser(userData);
      localStorage.setItem("token", userData.token);

      return userData;
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
      console.log(err)
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  return { user, loading, error, login, signup, logout };
};

export default useAuth;
