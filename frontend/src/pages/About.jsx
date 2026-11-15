import { Link } from "react-router-dom";
import {
  FileText,
  Database,
  Cpu,
  Layers,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  BookOpen,
  Binary,
  Microscope,
  Server
} from "lucide-react";
import { BACKEND_RENDER_URL } from "../api/client";

export default function About() {
  const datasetFeatures = [
    { name: "Radius", desc: "Mean of distances from center to points on the perimeter" },
    { name: "Texture", desc: "Standard deviation of gray-scale values" },
    { name: "Perimeter", desc: "Total nuclear boundary length" },
    { name: "Area", desc: "Total number of pixels within the nuclear boundary" },
    { name: "Smoothness", desc: "Local variation in radius lengths" },
    { name: "Compactness", desc: "Perimeter² / area - 1.0 (shape irregularity)" },
    { name: "Concavity", desc: "Severity of concave portions of the nuclear contour" },
    { name: "Concave Points", desc: "Number of concave portions of the nuclear contour" },
    { name: "Symmetry", desc: "Relative symmetry of the nuclear shape" },
    { name: "Fractal Dimension", desc: "Coastline approximation - 1 (boundary complexity)" }
  ];

  return (
    <div className="about-page">
      {/* Header Banner */}
      <section className="page-header">
        <div className="container">
          <div className="page-header-content">
            <span className="page-eyebrow">METHODOLOGY & ARCHITECTURE</span>
            <h1 className="page-title">About OncoPredict</h1>
            <p className="page-subtitle">
              A comprehensive technical overview of the machine learning pipeline, dataset origins, mathematical formulation, and production containerization.
            </p>
          </div>
        </div>
      </section>

      {/* Project Overview & Objectives */}
      <section className="section">
        <div className="container">
          <div className="grid-2-col">
            <div className="card-bordered">
              <div className="card-badge-icon">
                <BookOpen size={20} />
              </div>
              <h3 className="card-title">Project Mission & Context</h3>
              <p className="card-text">
                In machine learning education, students often train models inside Jupyter Notebooks where they remain isolated from actual software systems. <strong>OncoPredict (ML-14)</strong> serves as the bridge between model exploration and production deployment.
              </p>
              <p className="card-text">
                The objective is to operationalize an scikit-learn classification pipeline as a reliable RESTful microservice with schema validation, containerization, and a modern frontend interface.
              </p>
            </div>

            <div className="card-bordered">
              <div className="card-badge-icon">
                <CheckCircle2 size={20} />
              </div>
              <h3 className="card-title">Core Engineering Objectives</h3>
              <ul className="styled-list">
                <li>
                  <strong>Microservice Decoupling:</strong> Keep the FastAPI ML engine isolated from the user-facing web dashboard.
                </li>
                <li>
                  <strong>Schema Rigor:</strong> Prevent server crashes (500s) on malformed user inputs through strict Pydantic schemas.
                </li>
                <li>
                  <strong>Containerization:</strong> Docker container packaging model artifacts, dependencies, and WSGI/ASGI servers uniformly.
                </li>
                <li>
                  <strong>Zero-Downtime Resilience:</strong> Transparent proxying and automated health check polling to gracefully handle cloud cold-starts.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Machine Learning Model Deep-Dive */}
      <section className="section bg-light">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-eyebrow">CLASSIFICATION MODEL</span>
            <h2 className="section-title">The Scikit-Learn Pipeline Architecture</h2>
            <p className="section-desc">
              Model parameters are saved into a single persistent artifact using Python's <code>joblib</code> and loaded once upon FastAPI startup.
            </p>
          </div>

          <div className="grid-3-col">
            <div className="spec-card">
              <div className="spec-header">
                <Layers size={22} className="spec-icon" />
                <h4>1. StandardScaler</h4>
              </div>
              <p>
                Each raw measurement has drastically different magnitudes (e.g., Mean Area reaches &gt;2000, while Fractal Dimension is &lt;0.1). StandardScaler normalizes each feature to zero mean and unit variance:
              </p>
              <div className="formula-box">
                <code>z = (x - μ) / σ</code>
              </div>
            </div>

            <div className="spec-card">
              <div className="spec-header">
                <Binary size={22} className="spec-icon" />
                <h4>2. Logistic Regression</h4>
              </div>
              <p>
                A linear classifier that estimates the posterior probability of malignancy using the logistic sigmoid function with L2 ridge regularization:
              </p>
              <div className="formula-box">
                <code>P(Y=1|X) = 1 / (1 + e^-(w^T x + b))</code>
              </div>
            </div>

            <div className="spec-card">
              <div className="spec-header">
                <Cpu size={22} className="spec-icon" />
                <h4>3. Calibrated Probabilities</h4>
              </div>
              <p>
                The model uses <code>predict_proba()</code> to generate probability confidence intervals for both classes, giving practitioners quantitative insight into prediction uncertainty.
              </p>
              <div className="formula-box">
                <code>Confidence = max(P_0, P_1)</code>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dataset Breakdown */}
      <section className="section">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-eyebrow">TRAINING DATASET</span>
            <h2 className="section-title">Wisconsin Diagnostic Breast Cancer (WDBC)</h2>
            <p className="section-desc">
              Created by Dr. William H. Wolberg, W. Nick Street, and Olvi L. Mangasarian at the University of Wisconsin.
            </p>
          </div>

          <div className="dataset-meta-grid">
            <div className="meta-card">
              <span className="meta-num">569</span>
              <span className="meta-title">Patient Samples</span>
            </div>
            <div className="meta-card">
              <span className="meta-num">30</span>
              <span className="meta-title">Continuous Features</span>
            </div>
            <div className="meta-card">
              <span className="meta-num">212</span>
              <span className="meta-title">Malignant (Class 0)</span>
            </div>
            <div className="meta-card">
              <span className="meta-num">357</span>
              <span className="meta-title">Benign (Class 1)</span>
            </div>
          </div>

          <div className="features-table-card">
            <h3>The 10 Base Nuclear Characteristics (3 Variations Each: Mean, SE, Worst)</h3>
            <div className="features-subgrid">
              {datasetFeatures.map((f, i) => (
                <div className="feature-item" key={i}>
                  <div className="feature-item-num">{i + 1}</div>
                  <div>
                    <strong>{f.name}</strong>
                    <p>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Prominent Educational & Medical Disclaimer */}
      <section className="section disclaimer-section">
        <div className="container">
          <div className="medical-disclaimer-box">
            <div className="disclaimer-title-row">
              <ShieldAlert size={28} className="warning-icon" />
              <div>
                <h3>Important Medical & Educational Disclaimer</h3>
                <span className="disclaimer-sub">Mandatory compliance notice for academic projects</span>
              </div>
            </div>
            <div className="disclaimer-body">
              <p>
                <strong>Educational and Demonstration Scope:</strong> The OncoPredict software platform, including its machine learning models, REST endpoints, and web interfaces, was developed solely for academic research, computer science coursework, and machine learning deployment demonstrations.
              </p>
              <p>
                <strong>No Clinical Diagnostic Clearance:</strong> This application has not been evaluated, verified, cleared, or approved by the United States Food and Drug Administration (FDA), European Medicines Agency (EMA), or any other regulatory health authority.
              </p>
              <p>
                <strong>Not Medical Advice:</strong> Predictions generated by this system must <strong>never</strong> be interpreted as medical advice, clinical diagnoses, or prognostic evaluations. Healthcare decisions should only be made by licensed medical practitioners using accredited pathology and clinical diagnostic methodologies.
              </p>
            </div>
          </div>

          <div className="cta-centered">
            <Link to="/prediction" className="btn-primary-large">
              <span>Try the Prediction Engine</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
