import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  Microscope,
  ArrowRight,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Info,
  ExternalLink,
  ShieldCheck
} from "lucide-react";
import {
  FEATURE_NAMES,
  SAMPLE_MALIGNANT,
  SAMPLE_BENIGN,
  predictBreastCancer,
  savePredictionToHistory,
  BACKEND_RENDER_URL
} from "../api/client";

export default function Prediction() {
  const [features, setFeatures] = useState(Array(30).fill(""));
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activePreset, setActivePreset] = useState(null);

  const handleChange = (index, value) => {
    const updated = [...features];
    updated[index] = value;
    setFeatures(updated);
    setActivePreset(null);
  };

  const loadPreset = (type) => {
    const sample = type === "malignant" ? SAMPLE_MALIGNANT : SAMPLE_BENIGN;
    setFeatures(sample.map(String));
    setResult(null);
    setError("");
    setActivePreset(type);
  };

  const handleReset = () => {
    setFeatures(Array(30).fill(""));
    setResult(null);
    setError("");
    setActivePreset(null);
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);

    // Validation 1: All 30 fields filled
    for (let i = 0; i < features.length; i++) {
      if (features[i] === "" || features[i] === null || features[i] === undefined) {
        setError(`Please enter a value for feature #${i + 1}: ${FEATURE_NAMES[i]}. (Or use a Quick Fill preset above).`);
        return;
      }
    }

    // Validation 2: All values numeric
    const numericFeatures = features.map(Number);
    for (let i = 0; i < numericFeatures.length; i++) {
      if (!Number.isFinite(numericFeatures[i])) {
        setError(`Feature #${i + 1} (${FEATURE_NAMES[i]}) must be a valid finite number.`);
        return;
      }
    }

    setLoading(true);

    try {
      const data = await predictBreastCancer(numericFeatures);
      setResult(data);
      // Persist to local telemetry for the Dashboard
      savePredictionToHistory(numericFeatures, data);
    } catch (err) {
      setError(
        err.message ||
        "Inference failed. The Render backend service may be waking up from cold-sleep (allow ~30s) or check your connection."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="prediction-page">
      <div className="container">
        {/* Header Section */}
        <section className="page-header">
          <div className="page-header-content">
            <span className="page-eyebrow">
              <Microscope size={14} /> LIVE INFERENCE ENGINE
            </span>
            <h1 className="page-title">Breast Cancer Feature Analysis</h1>
            <p className="page-subtitle">
              Submit the 30 continuous cytology measurements extracted from fine needle aspirate (FNA) images to obtain calibrated classification from the containerized ML model.
            </p>
          </div>
        </section>

        {/* Prediction Form Card */}
        <section className="form-card-container">
          <div className="form-card-header">
            <div className="header-left">
              <h2>Cytology Feature Vector Input</h2>
              <p>Enter the 30 standardized morphometric parameters or select a verified test preset.</p>
            </div>

            {/* Quick Fill Preset Buttons */}
            <div className="preset-selector">
              <span className="preset-label">
                <Sparkles size={14} /> Quick Fill Presets:
              </span>
              <button
                type="button"
                className={`preset-btn malignant ${activePreset === "malignant" ? "active" : ""}`}
                onClick={() => loadPreset("malignant")}
                title="Fill with confirmed Malignant sample (Class 0)"
              >
                Malignant Sample
              </button>
              <button
                type="button"
                className={`preset-btn benign ${activePreset === "benign" ? "active" : ""}`}
                onClick={() => loadPreset("benign")}
                title="Fill with confirmed Benign sample (Class 1)"
              >
                Benign Sample
              </button>
            </div>
          </div>

          <form onSubmit={handlePredict} className="prediction-form">
            <div className="feature-inputs-grid">
              {FEATURE_NAMES.map((name, index) => (
                <div className="feature-input-group" key={index}>
                  <label htmlFor={`feature-field-${index}`}>
                    <span className="index-tag">{index + 1}</span>
                    <span className="feature-title-text">{name}</span>
                  </label>
                  <input
                    id={`feature-field-${index}`}
                    type="number"
                    step="any"
                    value={features[index]}
                    onChange={(e) => handleChange(index, e.target.value)}
                    placeholder="0.00"
                    required
                  />
                </div>
              ))}
            </div>

            {/* Error Banner */}
            {error && (
              <div className="prediction-error-banner">
                <AlertTriangle size={18} className="error-icon" />
                <div className="error-text-content">
                  <strong>Validation or Inference Error:</strong>
                  <p>{error}</p>
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className="prediction-form-actions">
              <button
                type="button"
                className="btn-clear-form"
                onClick={handleReset}
              >
                <RotateCcw size={16} />
                <span>Clear Form</span>
              </button>

              <button
                type="submit"
                className="btn-run-prediction"
                disabled={loading}
              >
                {loading ? (
                  <span>Evaluating Cytology Vector...</span>
                ) : (
                  <>
                    <span>Run Model Prediction</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          </form>
        </section>

        {/* Prediction Result Display */}
        {result && (
          <section className={`result-display-section ${result.prediction === 0 ? "is-malignant" : "is-benign"}`}>
            <div className="result-display-header">
              <div className="result-status-icon">
                {result.prediction === 0 ? (
                  <AlertTriangle size={32} />
                ) : (
                  <CheckCircle2 size={32} />
                )}
              </div>
              <div className="result-title-group">
                <span className="result-caption">Scikit-Learn Logistic Regression Output</span>
                <h2 className="result-diagnosis-name">
                  {result.result} Classification
                </h2>
              </div>
              <div className="result-class-badge">
                <span>Class Code: {result.prediction}</span>
              </div>
            </div>

            <div className="result-metrics-row">
              <div className="result-metric-card">
                <span className="result-metric-label">Model Classification</span>
                <span className={`result-metric-value ${result.prediction === 0 ? "text-red" : "text-green"}`}>
                  {result.result}
                </span>
                <span className="result-metric-note">
                  {result.prediction === 0 ? "Indicates cellular malignancy" : "Indicates non-cancerous benign cell"}
                </span>
              </div>

              <div className="result-metric-card">
                <span className="result-metric-label">Calibrated Confidence</span>
                <span className="result-metric-value">
                  {(result.confidence * 100).toFixed(2)}%
                </span>
                <span className="result-metric-note">Posterior sigmoid probability</span>
              </div>

              <div className="result-metric-card">
                <span className="result-metric-label">Inference Status</span>
                <span className="result-metric-value text-teal">200 OK</span>
                <span className="result-metric-note">Render FastAPI Container</span>
              </div>
            </div>

            {/* Confidence Progress Bar */}
            <div className="result-confidence-bar-wrap">
              <div className="bar-labels">
                <span>Model Certainty Distribution</span>
                <strong>{(result.confidence * 100).toFixed(2)}%</strong>
              </div>
              <div className="bar-track">
                <div
                  className={`bar-fill ${result.prediction === 0 ? "fill-red" : "fill-green"}`}
                  style={{ width: `${Math.min(100, Math.max(12, result.confidence * 100))}%` }}
                />
              </div>
            </div>

            {/* Saved Telemetry Notice */}
            <div className="result-saved-footer">
              <CheckCircle2 size={16} className="text-teal" />
              <span>
                Prediction recorded in your browser session. View telemetry in your{" "}
                <Link to="/dashboard" className="link-underline">
                  Researcher Dashboard
                </Link>.
              </span>
            </div>
          </section>
        )}

        {/* Educational Disclaimer */}
        <div className="page-disclaimer-card">
          <Info size={19} className="disclaimer-icon" />
          <p>
            <strong>Research Notice:</strong> This prediction engine serves an academic machine learning model for instructional purposes. Output generated by this system must not be considered a medical diagnosis or utilized for clinical decision-making.
          </p>
        </div>
      </div>
    </div>
  );
}
