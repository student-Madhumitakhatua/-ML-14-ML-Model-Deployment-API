import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Activity,
  Microscope,
  Cpu,
  ArrowRight,
  Database,
  Server,
  Zap,
  CheckCircle2,
  FileText,
  Lock,
  ExternalLink,
  Layers,
  Sparkles
} from "lucide-react";
import { BACKEND_RENDER_URL } from "../api/client";

export default function Home() {
  const features = [
    {
      icon: Microscope,
      title: "30 Clinical FNA Cytology Features",
      desc: "Evaluates 10 core morphological characteristics across mean, standard error, and worst-case dimensions extracted from digitized fine needle aspirates."
    },
    {
      icon: Zap,
      title: "Real-Time Containerized Inference",
      desc: "FastAPI REST API hosted inside a lightweight Docker container, achieving low-latency sub-second response times for real-time decision support."
    },
    {
      icon: Cpu,
      title: "Validated Scikit-Learn Pipeline",
      desc: "Combines a standard scaler with an L2-regularized Logistic Regression classifier trained on verified Wisconsin Diagnostic Breast Cancer data."
    },
    {
      icon: Activity,
      title: "Calibrated Probabilistic Confidence",
      desc: "Outputs not just a binary classification (Malignant or Benign), but an exact calibrated probability score indicating model certainty."
    },
    {
      icon: Server,
      title: "Decoupled Microservice Architecture",
      desc: "Frontend hosted globally on Vercel's Edge network, communicating over HTTPS through server-side reverse proxies to backend container on Render."
    },
    {
      icon: Lock,
      title: "Zero In-Memory Patient Retention",
      desc: "Stateless architecture processes requests in-flight without persisting sensitive health parameters to external storage."
    }
  ];

  const steps = [
    {
      step: "01",
      title: "Input Cytology Measurements",
      desc: "Provide the 30 continuous real-valued measurements (radius, texture, concavity, symmetry, etc.) or load standard clinical test presets."
    },
    {
      step: "02",
      title: "Automated Pipeline Scaling",
      desc: "StandardScaler transforms raw features using empirical mean and unit variance parameters learned during supervised training."
    },
    {
      step: "03",
      title: "Logistic Regression Inference",
      desc: "The trained classifier computes the sigmoid decision boundary to evaluate malignancy likelihood."
    },
    {
      step: "04",
      title: "Clear Diagnostic Feedback",
      desc: "Receive structured JSON response containing classification label, binary class code, and percentage confidence certainty."
    }
  ];

  const techStack = [
    { name: "FastAPI", category: "Backend Framework", badge: "Python 3.11" },
    { name: "Scikit-Learn", category: "ML Pipeline & Training", badge: "LogisticRegression" },
    { name: "Docker", category: "Containerization", badge: "Debian Slim" },
    { name: "React 19 & Vite", category: "Frontend Engine", badge: "SPA Architecture" },
    { name: "Render Cloud", category: "API Web Service", badge: "Uvicorn ASGI" },
    { name: "Vercel Edge", category: "Frontend Deployment", badge: "Global CDN" }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <Sparkles size={14} />
              <span>CLINICAL MACHINE LEARNING DEMONSTRATION</span>
            </div>

            <h1 className="hero-title">
              AI-Powered <span className="text-teal">Breast Cancer</span> Prediction
            </h1>

            <p className="hero-subtitle">
              OncoPredict bridges machine learning research and clinical software engineering. Serving a trained 30-feature scikit-learn classifier through a containerized FastAPI microservice with instant real-time browser inference.
            </p>

            <div className="hero-cta-group">
              <Link to="/prediction" className="btn-primary-large">
                <span>Start Prediction</span>
                <ArrowRight size={18} />
              </Link>
              <Link to="/about" className="btn-secondary-large">
                <span>Learn Methodology</span>
              </Link>
            </div>

            <div className="hero-metrics">
              <div className="metric-pill">
                <span className="metric-num">30</span>
                <span className="metric-label">FNA Dimensions</span>
              </div>
              <div className="metric-divider" />
              <div className="metric-pill">
                <span className="metric-num">97%+</span>
                <span className="metric-label">Test Accuracy</span>
              </div>
              <div className="metric-divider" />
              <div className="metric-pill">
                <span className="metric-num">&lt;200ms</span>
                <span className="metric-label">Inference Latency</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="visual-card">
              <div className="card-top-bar">
                <span className="dot red" />
                <span className="dot yellow" />
                <span className="dot green" />
                <span className="card-title">Live Inference Monitor</span>
              </div>

              <div className="visual-body">
                <div className="sample-prediction-preview">
                  <div className="preview-header">
                    <div className="preview-icon malignant">
                      <Activity size={22} />
                    </div>
                    <div>
                      <span className="preview-label">Classification Output</span>
                      <h4 className="preview-result">Malignant Diagnosis</h4>
                    </div>
                    <span className="confidence-chip high">100% Certainty</span>
                  </div>

                  <div className="preview-meter">
                    <div className="meter-labels">
                      <span>Model Probability</span>
                      <span>1.0000</span>
                    </div>
                    <div className="meter-track">
                      <div className="meter-fill" style={{ width: "100%" }} />
                    </div>
                  </div>

                  <div className="preview-code-block">
                    <span className="code-lang">JSON API Payload</span>
                    <code>{`{ "prediction": 0, "result": "Malignant", "confidence": 1.0 }`}</code>
                  </div>
                </div>

                <div className="visual-footer">
                  <div className="api-chip">
                    <span className="pulse-indicator" />
                    <span>FastAPI Render Service</span>
                  </div>
                  <a
                    href={`${BACKEND_RENDER_URL}/docs`}
                    target="_blank"
                    rel="noreferrer"
                    className="visual-link"
                  >
                    View Docs <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="section features-section">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-eyebrow">SYSTEM CAPABILITIES</span>
            <h2 className="section-title">Engineered for Production Inference</h2>
            <p className="section-desc">
              Designed from first principles to represent real-world medical AI deployments with containerization, strong schemas, and clear confidence scores.
            </p>
          </div>

          <div className="features-grid">
            {features.map((item, index) => {
              const Icon = item.icon;
              return (
                <div className="feature-card" key={index}>
                  <div className="feature-icon-wrapper">
                    <Icon size={24} />
                  </div>
                  <h3 className="feature-title">{item.title}</h3>
                  <p className="feature-desc">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Workflow */}
      <section className="section workflow-section">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-eyebrow">INFERENCE PIPELINE</span>
            <h2 className="section-title">How OncoPredict Processes Requests</h2>
            <p className="section-desc">
              From raw FNA cytology parameters to calibrated predictive outcomes in milliseconds.
            </p>
          </div>

          <div className="workflow-grid">
            {steps.map((item, index) => (
              <div className="workflow-card" key={index}>
                <span className="workflow-step-num">{item.step}</span>
                <h3 className="workflow-title">{item.title}</h3>
                <p className="workflow-desc">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="workflow-cta-banner">
            <div className="banner-text">
              <h3>Ready to test the model?</h3>
              <p>Explore the dedicated interactive prediction form with instant one-click test cases.</p>
            </div>
            <Link to="/prediction" className="btn-primary-large">
              <span>Open Prediction Interface</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Technology Stack Grid */}
      <section className="section tech-section">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-eyebrow">FULL-STACK ARCHITECTURE</span>
            <h2 className="section-title">Modern Production Technology Stack</h2>
            <p className="section-desc">
              Every layer of the application is separated into focused, maintainable microservices.
            </p>
          </div>

          <div className="tech-grid">
            {techStack.map((tech, i) => (
              <div className="tech-card" key={i}>
                <div className="tech-badge">{tech.badge}</div>
                <h4 className="tech-name">{tech.name}</h4>
                <p className="tech-category">{tech.category}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Overview Preview */}
      <section className="section about-preview-section">
        <div className="container">
          <div className="about-preview-box">
            <div className="about-preview-content">
              <span className="section-eyebrow">DATASET & CLINICAL CONTEXT</span>
              <h2>Trained on the Wisconsin Diagnostic Dataset</h2>
              <p>
                Features are computed from a digitized image of a fine needle aspirate (FNA) of a breast mass, describing characteristics of cell nuclei present in the image.
              </p>
              <ul className="preview-checklist">
                <li><CheckCircle2 size={16} /> 569 patient samples with 30 continuous real-valued features</li>
                <li><CheckCircle2 size={16} /> Verified binary ground truth: Malignant (0) and Benign (1)</li>
                <li><CheckCircle2 size={16} /> L2 Regularization to safeguard against overfitting</li>
              </ul>
              <Link to="/about" className="btn-secondary">
                Read Full Model Documentation
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
