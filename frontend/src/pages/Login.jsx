import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  HeartPulse,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Info,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("researcher@oncopredict.org");
  const [password, setPassword] = useState("Demonstration123!");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [showForgotNotice, setShowForgotNotice] = useState(false);

  const { login, isDemoAuth } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !email.includes("@")) {
      setError("Please provide a valid email address.");
      return;
    }

    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    // Authenticate demo session
    login(email, password);
    navigate("/dashboard");
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Auth Card */}
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-brand-badge">
              <HeartPulse size={20} />
            </div>
            <h1 className="auth-title">Researcher Portal Sign In</h1>
            <p className="auth-subtitle">
              Access the clinical prediction dashboard and telemetry workspace.
            </p>
          </div>

          {/* Explicit Demonstration Notice */}
          <div className="demo-mode-alert">
            <Info size={18} className="demo-alert-icon" />
            <div>
              <strong>Frontend Demonstration Mode:</strong>
              <p>
                The production backend serves the ML inference API exclusively without an external user database. You can sign in with any valid email to experience the clinician dashboard.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="login-email">Academic / Institutional Email</label>
              <div className="input-with-icon">
                <Mail size={18} className="input-icon" />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@institution.edu"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div className="label-row">
                <label htmlFor="login-password">Password</label>
                <button
                  type="button"
                  className="link-btn-subtle"
                  onClick={() => setShowForgotNotice(true)}
                >
                  Forgot password?
                </button>
              </div>

              <div className="input-with-icon">
                <Lock size={18} className="input-icon" />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {showForgotNotice && (
              <div className="forgot-notice-box">
                <Info size={16} />
                <span>
                  Password reset service is not available in frontend demo mode. You can enter any 6+ character password to proceed.
                </span>
              </div>
            )}

            <div className="form-options">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Keep me signed in for this session</span>
              </label>
            </div>

            {error && (
              <div className="auth-error-banner">
                <span>{error}</span>
              </div>
            )}

            <button type="submit" className="btn-auth-submit">
              <span>Sign In to Dashboard</span>
              <ArrowRight size={17} />
            </button>
          </form>

          <div className="auth-footer-nav">
            <p>
              Don't have an institutional demo account?{" "}
              <Link to="/signup" className="auth-accent-link">
                Sign Up for Access
              </Link>
            </p>
          </div>
        </div>

        {/* Informative Side Card */}
        <div className="auth-side-info">
          <h3>OncoPredict Security & Integrity</h3>
          <ul className="security-points">
            <li>
              <ShieldCheck size={18} />
              <div>
                <strong>Containerized Isolation</strong>
                <p>FastAPI inference runs in protected Docker containers.</p>
              </div>
            </li>
            <li>
              <CheckCircle2 size={18} />
              <div>
                <strong>No Cloud PHI Storage</strong>
                <p>Clinical measurements are evaluated strictly in-memory.</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
