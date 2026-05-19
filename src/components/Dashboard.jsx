import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useHubs from "../hooks/useHubs";
import useRoutes from "../hooks/useRoutes";
import useAnalytics from "../hooks/useAnalytics";
import useOptimizeRoute from "../hooks/useOptimizeRoute";
import "./Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  const { hubs } = useHubs();
  const { routes, updateTraffic, toggleBlocked } = useRoutes();
  const { analytics } = useAnalytics();
  const { optimizedRoute, loading, optimizeRoute } = useOptimizeRoute();

  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const handleOptimizeRoute = () => {
    optimizeRoute(start, end);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="dashboard-container">
      {/* HEADER */}

      <div className="dashboard-header">
        <h1>Logistics Route Optimization Dashboard</h1>

        <p>Real-time delivery route optimization system</p>
        
        <button onClick={handleLogout} className="btn-logout">
          Logout
        </button>
      </div>

      {/* TOP SECTION */}

      <div className="dashboard-grid">
        {/* ROUTE OPTIMIZATION */}

        <div className="card">
          <div className="card-header">
            <h2>Route Optimization</h2>
          </div>

          <div className="form-row">
            {/* SOURCE */}

            <div className="form-group">
              <label>Source Hub</label>

              <select
                value={start}
                onChange={(e) => setStart(e.target.value)}
              >
                <option value="">Select Source</option>

                {hubs.map((hub) => (
                  <option key={hub._id} value={hub._id}>
                    {hub.name}
                  </option>
                ))}
              </select>
            </div>

            {/* DESTINATION */}

            <div className="form-group">
              <label>Destination Hub</label>

              <select
                value={end}
                onChange={(e) => setEnd(e.target.value)}
              >
                <option value="">Select Destination</option>

                {hubs.map((hub) => (
                  <option key={hub._id} value={hub._id}>
                    {hub.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* BUTTON */}

          <button
            onClick={handleOptimizeRoute}
            disabled={loading}
            className="btn-primary"
          >
            {loading ? "Calculating..." : "Find Optimal Route"}
          </button>

          {/* RESULT */}

          {optimizedRoute && (
            <div className="result-card">
              <h3>Optimized Route</h3>

              <div>
                <p className="result-item">
                  <span className="result-label">Path:</span>{" "}
                  {optimizedRoute.path
                    ?.map((hubId) => {
                      const hub = hubs.find((h) => h._id === hubId);
                      return hub ? hub.name : hubId;
                    })
                    .join(" → ")}
                </p>

                <p className="result-item">
                  <span className="result-label">Total Cost:</span>{" "}
                  {optimizedRoute.totalCost}
                </p>

                <p style={{ color: "var(--accent)", fontWeight: 500 }}>
                  ✅ Route Available
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ANALYTICS */}

        <div className="card">
          <div className="card-header">
            <h2>Top 5 Fastest Routes</h2>
          </div>

          <div className="analytics-list">
            {analytics.map((route, index) => {
              const fromHub = route.fromHub;
              const toHub = route.toHub;
              return (
                <div
                  key={route._id}
                  className="analytics-item"
                >
                  <p className="analytics-rank">
                    #{index + 1}
                  </p>

                  <p className="analytics-stat">
                    {fromHub ? fromHub.name : "—"} → {toHub ? toHub.name : "—"}
                  </p>

                  <p className="analytics-stat">
                    Travel Time: {route.travelTime} mins
                  </p>

                  <p className="analytics-stat">
                    Distance: {route.distance} km
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ROUTE TABLE */}

      <div className="card">
        <div className="section-header">
          <h2>Route Network</h2>

          <p className="section-subtitle">
            Manage traffic conditions and blocked routes
          </p>
        </div>

        <div className="table-container">
          <table className="route-table">
            <thead>
              <tr>
                <th>From Hub</th>

                <th>To Hub</th>

                <th>Distance</th>

                <th>Travel Time</th>

                <th>Fuel Cost</th>

                <th>Traffic</th>

                <th>Status</th>

                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
               {routes.map((route) => {
                  const fromHub = route.fromHub;
                  const toHub = route.toHub;
                  return (
                    <tr
                      key={route._id}
                    >
                      <td>
                        {fromHub ? fromHub.name : "—"}
                      </td>

                      <td>
                        {toHub ? toHub.name : "—"}
                      </td>

                     <td>
                       {route.distance} km
                     </td>

                  <td>
                    {route.travelTime} mins
                  </td>

                  <td>
                    {route.fuelCost}
                  </td>

                  {/* TRAFFIC */}

                  <td>
                    <select
                      value={route.trafficLevel}
                      onChange={(e) =>
                        updateTraffic(
                          route._id,
                          e.target.value
                        )
                      }
                      className="traffic-select"
                    >
                      <option value="LOW">LOW</option>
                      <option value="MEDIUM">
                        MEDIUM
                      </option>
                      <option value="HIGH">HIGH</option>
                    </select>
                  </td>

                  {/* STATUS */}

                  <td>
                    {route.isBlocked ? (
                      <span className="status-badge status-blocked">
                        BLOCKED
                      </span>
                    ) : (
                      <span className="status-badge status-active">
                        ACTIVE
                      </span>
                    )}
                  </td>

                  {/* ACTION */}

                  <td>
                    <button
                      onClick={() =>
                        toggleBlocked(
                          route._id,
                          route.isBlocked
                        )
                      }
                      className={`btn-action ${
                        route.isBlocked
                          ? "btn-unblock"
                          : "btn-block"
                      }`}
                    >
                      {route.isBlocked
                        ? "Unblock"
                        : "Block"}
                    </button>
                  </td>
                </tr>
              );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}