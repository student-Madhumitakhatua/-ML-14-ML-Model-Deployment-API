import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  User,
  Activity,
  ArrowRight,
  ShieldCheck,
  Microscope,
  Clock,
  Trash2,
  ExternalLink,
  Sparkles,
  Info,
  CheckCircle2,
  AlertTriangle,
  FileText
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getLocalPredictionHistory, clearPredictionHistory, BACKEND_RENDER_URL } from "../api/client";

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    setHistory(getLocalPredictionHistory());
  }, []);

  const handleClearHistory = () => {
    if (window.confirm("Clear all local prediction records in this browser session?")) {
      clearPredictionHistory();
      setHistory([]);
    }
  };

  const totalRuns = history.length;
  const malignantCount = history.filter((h) => h.prediction === 0).length;
  const benignCount = history.filter((h) => h.prediction === 1).length;
  const avgConfidence = totalRuns > 0
    ? (history.reduce((acc, curr) => acc + (curr.confidence || 0), 0) / totalRuns * 100).toFixed(1)
    : "—";

  return (
    <div className="dashboard-page">
      <div className="container">
        {/* Welcome Section */}
        <section className="dashboard-header">
          <div className="header-greeting">
            <span className="welcome-tag">
              <Sparkles size={14} /> PRACTITIONER WORKSPACE
            </span>
            <h1 className="dashboard-title">
              Welcome, {isAuthenticated ? user.name : "Visiting Researcher"}
            </h1>
            <p className="dashboard-sub">
              Manage your local cytology inference telemetry, view recent predictions, and monitor API connectivity.
            </p>
          </div>

          <div className="dashboard-cta">
            <Link to="/prediction" className="btn-primary-large">
              <Activity size={18} />
              <span>Start New Prediction</span>
            </Link>
          </div>
        </section>

        {/* Profile Card & Session Notice */}
        <div className="user-status-banner">
          <div className="user-badge-left">
            <div className="user-avatar-large">
              {isAuthenticated ? user.avatarInitial : "V"}
            </div>
            <div>
              <div className="user-role-row">
                <span className="user-full-name">{isAuthenticated ? user.name : "Visiting Clinician"}</span>
                <span className="demo-chip">Session Demo Mode</span>
              </div>
              <p className="user-email-text">
                {isAuthenticated ? user.email : "Unregistered Guest Session (Local Storage Enabled)"}
              </p>
            </div>
          </div>

          {!isAuthenticated && (
            <div className="signin-prompt">
              <span>Sign in to personalize your workspace session:</span>
              <Link to="/login" className="btn-secondary-small">Sign In</Link>
            </div>
          )}
        </div>

        {/* Metrics Grid */}
        <section className="dashboard-metrics-grid">
          <div className="metric-box">
            <div className="metric-header">
              <span className="metric-box-title">Session Predictions</span>
              <Activity size={18} className="metric-box-icon" />
            </div>
            <div className="metric-box-num">{totalRuns}</div>
            <span className="metric-box-sub">Evaluated in this browser session</span>
          </div>

          <div className="metric-box">
            <div className="metric-header">
              <span className="metric-box-title">Malignant Cases</span>
              <AlertTriangle size={18} className="metric-box-icon text-red" />
            </div>
            <div className="metric-box-num text-red">{malignantCount}</div>
            <span className="metric-box-sub">Class 0 classifications</span>
          </div>

          <div className="metric-box">
            <div className="metric-header">
              <span className="metric-box-title">Benign Cases</span>
              <CheckCircle2 size={18} className="metric-box-icon text-green" />
            </div>
            <div className="metric-box-num text-green">{benignCount}</div>
            <span className="metric-box-sub">Class 1 classifications</span>
          </div>

          <div className="metric-box">
            <div className="metric-header">
              <span className="metric-box-title">Mean Confidence</span>
              <ShieldCheck size={18} className="metric-box-icon text-teal" />
            </div>
            <div className="metric-box-num text-teal">{avgConfidence}{avgConfidence !== "—" ? "%" : ""}</div>
            <span className="metric-box-sub">Average model certainty</span>
          </div>
        </section>

        {/* Quick Action Cards */}
        <section className="dashboard-actions-grid">
          <Link to="/prediction" className="action-card highlight">
            <div className="action-icon">
              <Microscope size={24} />
            </div>
            <h3>Run Model Inference</h3>
            <p>Input 30 FNA cytology dimensions or load standard Malignant / Benign sample cases.</p>
            <span className="action-link">Open Prediction Engine →</span>
          </Link>

          <Link to="/about" className="action-card">
            <div className="action-icon">
              <FileText size={24} />
            </div>
            <h3>Model Specifications</h3>
            <p>Inspect the scikit-learn Logistic Regression parameters, scaling formulation, and WDBC dataset.</p>
            <span className="action-link">Review Methodology →</span>
          </Link>

          <a href={`${BACKEND_RENDER_URL}/docs`} target="_blank" rel="noreferrer" className="action-card">
            <div className="action-icon">
              <ExternalLink size={24} />
            </div>
            <h3>FastAPI Interactive Docs</h3>
            <p>Inspect Swagger/OpenAPI documentation for the live Dockerized microservice on Render.</p>
            <span className="action-link">Open Swagger UI ↗</span>
          </a>
        </section>

        {/* Recent Prediction History */}
        <section className="history-section">
          <div className="history-header">
            <div>
              <h2>Recent Browser Session Predictions</h2>
              <p>Telemetry recorded locally in your browser when executing inferences.</p>
            </div>
            {history.length > 0 && (
              <button
                type="button"
                className="btn-clear-history"
                onClick={handleClearHistory}
              >
                <Trash2 size={15} />
                <span>Clear History</span>
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <div className="empty-history-card">
              <div className="empty-icon-wrap">
                <Clock size={32} />
              </div>
              <h3>No Prediction Telemetry Yet</h3>
              <p>
                You haven't run any predictions in this browser session. Head over to the Prediction Engine to evaluate your first cytology sample.
              </p>
              <Link to="/prediction" className="btn-primary">
                Launch Prediction Engine
              </Link>
            </div>
          ) : (
            <div className="history-table-wrapper">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Diagnosis Result</th>
                    <th>Class</th>
                    <th>Certainty</th>
                    <th>Mean Radius</th>
                    <th>Mean Texture</th>
                    <th>Mean Area</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item) => (
                    <tr key={item.id}>
                      <td className="timestamp-cell">
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                        <span className="date-sub">
                          {new Date(item.timestamp).toLocaleDateString([], { month: "short", day: "numeric" })}
                        </span>
                      </td>
                      <td>
                        <span className={`result-tag ${item.prediction === 0 ? "malignant" : "benign"}`}>
                          {item.result}
                        </span>
                      </td>
                      <td><code>{item.prediction}</code></td>
                      <td>
                        <strong>{(item.confidence * 100).toFixed(1)}%</strong>
                      </td>
                      <td>{item.meanRadius ?? "—"}</td>
                      <td>{item.meanTexture ?? "—"}</td>
                      <td>{item.meanArea ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Educational Note */}
        <div className="dashboard-notice-box">
          <Info size={18} />
          <p>
            <strong>Session Scope:</strong> This dashboard records runtime predictions within your local browser storage. It does not synchronize patient records to an external electronic health record (EHR) database.
          </p>
        </div>
      </div>
    </div>
  );
}
