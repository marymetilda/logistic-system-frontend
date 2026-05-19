import { useState } from "react";
import api from "./api";

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post("/auth/login", credentials);
      console.log("Login response:", response.data);
      
      // Store token in localStorage - handle different response structures
      const token = response.data?.token || response.data?.data?.token || response.data?.accessToken;
      if (token) {
        localStorage.setItem("token", token);
        console.log("Token stored:", token);
      } else {
        console.warn("No token found in response:", response.data);
      }
      return response.data;
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};

export default useLogin;