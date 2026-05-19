import { useState, useEffect } from "react";
import api from "./api";

const useHubs = () => {
  const [hubs, setHubs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchHubs = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No authentication token found");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/hubs");
      setHubs(res.data.data || []);
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHubs();
  }, []);

  return { hubs, loading, error, refetch: fetchHubs };
};

export default useHubs;