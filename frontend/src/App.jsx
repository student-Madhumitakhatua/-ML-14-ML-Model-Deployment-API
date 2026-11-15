import { useState, useEffect } from "react";
import {
  Activity,
  HeartPulse,
  ShieldCheck,
  Microscope,
  ArrowRight,
  RotateCcw,
  Info,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Sparkles
} from "lucide-react";

import "./App.css";

const BACKEND_RENDER_URL = "https://ml-14-breast-cancer-api.onrender.com";

// Smart fetch: proxies through /api on Vercel/Vite to bypass CORS, with automatic fallback
async function fetchWithFallback(path, options = {}) {
  try {
    const res = await fetch(`/api${path}`, options);
    if (res.status === 404 || res.status === 405) {
      return await fetch(`${BACKEND_RENDER_URL}${path}`, options);
    }
    return res;
  } catch {
    return await fetch(`${BACKEND_RENDER_URL}${path}`, options);
  }
}

const SAMPLE_MALIGNANT = [
  17.99, 10.38, 122.8, 1001.0, 0.1184, 0.2776, 0.3001, 0.1471, 0.2419, 0.07871,
  1.095, 0.9053, 8.589, 153.4, 0.006399, 0.04904, 0.05373, 0.01587, 0.03003, 0.006193,
  25.38, 17.33, 184.6, 2019.0, 0.1622, 0.6656, 0.7119, 0.2654, 0.4601, 0.1189
];

const SAMPLE_BENIGN = [
  13.54, 14.36, 87.46, 566.3, 0.09779, 0.08129, 0.06664, 0.04781, 0.1885, 0.05766,
  0.2699, 0.7886, 2.058, 23.56, 0.008462, 0.0146, 0.02387, 0.01315, 0.0198, 0.0023,
  15.11, 19.26, 99.7, 711.2, 0.144, 0.1773, 0.239, 0.1288, 0.2977, 0.07259
];

const FEATURE_NAMES = [
  "Mean Radius", "Mean Texture", "Mean Perimeter",
  "Mean Area", "Mean Smoothness", "Mean Compactness",
  "Mean Concavity", "Mean Concave Points", "Mean Symmetry",
  "Mean Fractal Dimension", "Radius Error", "Texture Error",
  "Perimeter Error", "Area Error", "Smoothness Error",
  "Compactness Error", "Concavity Error", "Concave Points Error",
  "Symmetry Error", "Fractal Dimension Error",
  "Worst Radius", "Worst Texture", "Worst Perimeter",
  "Worst Area", "Worst Smoothness", "Worst Compactness",
  "Worst Concavity", "Worst Concave Points",
  "Worst Symmetry", "Worst Fractal Dimension"
];

function App() {
  const [features, setFeatures] = useState(Array(30).fill(""));
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [apiStatus, setApiStatus] = useState("checking");

  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = async () => {
    setApiStatus("checking");
    try {
      const res = await fetchWithFallback("/health");
      if (res.ok) {
        const data = await res.json();
        setApiStatus(data.status === "healthy" ? "online" : "degraded");
      } else {
        setApiStatus("offline");
      }
    } catch {
      setApiStatus("offline");
    }
  };

  const handleChange = (index, value) => {
    const updated = [...features];
    updated[index] = value;
    setFeatures(updated);
  };

  const loadSample = (type) => {
    const sample = type === "malignant" ? SAMPLE_MALIGNANT : SAMPLE_BENIGN;
    setFeatures(sample.map(String));
    setResult(null);
    setError("");
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);

    if (features.some((value) => value.toString().trim() === "")) {
      setError("Please enter all 30 feature values (or use a Quick Fill button above).");
      return;
    }

    const numericFeatures = features.map(Number);

    if (numericFeatures.some((value) => !Number.isFinite(value))) {
      setError("Please enter valid numeric values for all features.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetchWithFallback("/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          features: numericFeatures
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Prediction failed.");
      }

      setResult(data);
    } catch (err) {
      setError(
        err.message ||
        "Unable to connect to prediction API. Render free tier may be waking up (allow 30-45s) or check your connection."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFeatures(Array(30).fill(""));
    setResult(null);
    setError("");
  };

  return (
    <div className="app">
      <nav className="navbar">
        <div className="brand">
          <div className="brand-icon">
            <HeartPulse size={24} />
          </div>
          <span>Onco<span className="brand-highlight">Predict</span></span>
        </div>

        <div className="nav-right">
          <div className={`nav-status ${apiStatus}`}>
            <span className={`status-dot ${apiStatus}`}></span>
            {apiStatus === "online" && "Render API Online"}
            {apiStatus === "checking" && "Connecting to API..."}
            {apiStatus === "offline" && "API Offline / Waking..."}
          </div>

          <a
            href="https://ml-14-breast-cancer-api.onrender.com/docs"
            target="_blank"
            rel="noreferrer"
            className="api-docs-link"
          >
            API Docs <ExternalLink size={14} />
          </a>
        </div>
      </nav>

      <main className="container">
        <section className="hero">
          <div className="hero-badge">
            <ShieldCheck size={15} />
            MACHINE LEARNING INFERENCE
          </div>

          <h1>
            Breast Cancer <span>Prediction System</span>
          </h1>

          <p>
            An end-to-end production ML deployment serving a trained classifier via FastAPI on Render, with real-time browser inference.
          </p>

          <div className="hero-stats">
            <div>
              <Microscope size={18} />
              <span>30 Features Validated</span>
            </div>
            <div>
              <Activity size={18} />
              <span>Logistic Regression Pipeline</span>
            </div>
            <div>
              <ShieldCheck size={18} />
              <span>FastAPI + Docker Container</span>
            </div>
          </div>
        </section>

        <section className="prediction-card">
          <div className="section-heading">
            <div>
              <h2>Patient Feature Analysis</h2>
              <p>Enter the 30 numerical measurements or use sample data presets below.</p>
            </div>

            <div className="sample-buttons">
              <span className="sample-label">
                <Sparkles size={14} /> Quick Fill:
              </span>
              <button
                type="button"
                className="sample-btn malignant"
                onClick={() => loadSample("malignant")}
              >
                Malignant Sample
              </button>
              <button
                type="button"
                className="sample-btn benign"
                onClick={() => loadSample("benign")}
              >
                Benign Sample
              </button>
            </div>
          </div>

          <form onSubmit={handlePredict}>
            <div className="feature-grid">
              {FEATURE_NAMES.map((name, index) => (
                <div className="input-group" key={index}>
                  <label htmlFor={`feature-${index}`}>
                    <span className="feature-num">{index + 1}</span> {name}
                  </label>

                  <input
                    id={`feature-${index}`}
                    type="number"
                    step="any"
                    value={features[index]}
                    onChange={(e) => handleChange(index, e.target.value)}
                    placeholder="0.00"
                  />
                </div>
              ))}
            </div>

            {error && (
              <div className="error-message">
                <AlertTriangle size={18} />
                <span>{error}</span>
              </div>
            )}

            <div className="form-actions">
              <button
                type="button"
                className="reset-btn"
                onClick={handleReset}
              >
                <RotateCcw size={16} />
                Clear Form
              </button>

              <button
                type="submit"
                className="predict-btn"
                disabled={loading}
              >
                {loading ? "Analyzing features..." : "Run ML Prediction"}
                {!loading && <ArrowRight size={18} />}
              </button>
            </div>
          </form>
        </section>

        {result && (
          <section className={`result-card result-${result.prediction === 0 ? "malignant" : "benign"}`}>
            <div className="result-header">
              <div className="result-icon">
                {result.prediction === 0 ? <AlertTriangle size={28} /> : <CheckCircle2 size={28} />}
              </div>
              <div>
                <span className="result-subtitle">Model Classification Result</span>
                <h3 className={`result-title ${result.prediction === 0 ? "malignant" : "benign"}`}>
                  {result.result}
                </h3>
              </div>
            </div>

            <div className="result-details">
              <div className="result-metric">
                <span className="metric-label">Prediction Label</span>
                <span className="metric-value">{result.prediction} ({result.result})</span>
              </div>
              <div className="result-metric">
                <span className="metric-label">Confidence Score</span>
                <span className="metric-value">{(result.confidence * 100).toFixed(2)}%</span>
              </div>
              <div className="result-metric">
                <span className="metric-label">Inference Status</span>
                <span className="metric-value status-success">Success (200 OK)</span>
              </div>
            </div>

            <div className="confidence-bar-container">
              <div className="confidence-bar-label">
                <span>Model Certainty</span>
                <span>{(result.confidence * 100).toFixed(2)}%</span>
              </div>
              <div className="confidence-track">
                <div
                  className={`confidence-fill ${result.prediction === 0 ? "fill-malignant" : "fill-benign"}`}
                  style={{ width: `${Math.min(100, Math.max(10, result.confidence * 100))}%` }}
                />
              </div>
            </div>
          </section>
        )}

        <div className="disclaimer">
          <Info size={19} />
          <p>
            <strong>Educational & Demonstration Notice:</strong> This application serves an educational ML model built with scikit-learn and FastAPI. It is intended for software development demonstration only and must never be used for actual clinical or medical diagnostics.
          </p>
        </div>
      </main>

      <footer>
        <p>© 2026 OncoPredict ML Inference Dashboard</p>
        <div className="footer-links">
          <span>Backend: FastAPI on Render</span>
          <span>•</span>
          <span>Frontend: React + Vite on Vercel</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
