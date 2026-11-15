import { useState, useEffect } from "react";
import { ExternalLink, RefreshCw } from "lucide-react";
import { checkBackendHealth, BACKEND_RENDER_URL } from "../api/client";

export default function ApiStatusBadge() {
  const [health, setHealth] = useState({ status: "checking", modelLoaded: false });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchStatus = async () => {
    setIsRefreshing(true);
    const res = await checkBackendHealth();
    setHealth(res);
    setIsRefreshing(false);
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 45000); // refresh every 45s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`api-status-badge ${health.status}`} title="Render FastAPI Backend Status">
      <span className={`status-dot ${health.status}`} />
      <span className="status-text">
        {health.status === "online" && "API Online"}
        {health.status === "checking" && "Connecting..."}
        {health.status === "offline" && "API Asleep"}
      </span>

      <button
        type="button"
        className={`status-refresh ${isRefreshing ? "spinning" : ""}`}
        onClick={fetchStatus}
        title="Refresh API Status"
        aria-label="Refresh status"
      >
        <RefreshCw size={11} />
      </button>

      <a
        href={`${BACKEND_RENDER_URL}/docs`}
        target="_blank"
        rel="noreferrer"
        className="status-docs-link"
        title="Open FastAPI Swagger Docs"
      >
        <ExternalLink size={11} />
      </a>
    </div>
  );
}
