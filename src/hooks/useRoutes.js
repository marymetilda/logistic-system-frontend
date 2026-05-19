import { useState, useEffect } from "react";
import api from "./api";

const useRoutes = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRoutes = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/routes");
      setRoutes(res.data.data || []);
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateTraffic = async (routeId, trafficLevel) => {
    try {
      await api.patch(`/routes/${routeId}/traffic`, { trafficLevel });
      await fetchRoutes();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleBlocked = async (routeId, isBlocked) => {
    try {
      await api.patch(`/routes/${routeId}/block`, { isBlocked: !isBlocked });
      await fetchRoutes();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  return { routes, loading, error, refetch: fetchRoutes, updateTraffic, toggleBlocked };
};

export default useRoutes;