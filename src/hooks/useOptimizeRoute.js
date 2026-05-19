import { useState } from "react";
import api from "./api";

const useOptimizeRoute = () => {
  const [optimizedRoute, setOptimizedRoute] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const optimizeRoute = async (start, end) => {
    if (!start || !end) return;

    setLoading(true);
    setError(null);
    try {
      const res = await api.post("/routes/optimize", {
        start,
        end,
      });
      setOptimizedRoute(res.data.data);
    } catch (err) {
      setError(err.message);
      console.error(err);
      alert("Failed to optimize route");
    } finally {
      setLoading(false);
    }
  };

  return { optimizedRoute, loading, error, optimizeRoute };
};

export default useOptimizeRoute;