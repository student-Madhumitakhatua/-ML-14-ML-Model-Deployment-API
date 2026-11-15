import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  HeartPulse,
  User,
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

export default function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!email.trim() || !email.includes("@")) {
      setError("Please provide a valid institutional email address.");
      return;
    }

    if (!password || password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }

    signup(fullName, email, password);
    navigate("/dashboard");
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-brand-badge">
              <HeartPulse size={20} />
            </div>
            <h1 className="auth-title">Create Demonstration Account</h1>
            <p className="auth-subtitle">
              Join the OncoPredict research workspace to run cytology predictions and save session telemetry.
            </p>
          </div>

          <div className="demo-mode-alert">
            <Info size={18} className="demo-alert-icon" />
            <div>
              <strong>Academic Project Demo:</strong>
              <p>
                This form registers a client-side practitioner session. No sensitive credentials or personal data are stored externally.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="signup-name">Full Name & Title</label>
              <div className="input-with-icon">
                <User size={18} className="input-icon" />
                <input
                  id="signup-name"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Dr. Jane Doe, MD"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="signup-email">Institutional Email</label>
              <div className="input-with-icon">
                <Mail size={18} className="input-icon" />
                <input
                  id="signup-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="j.doe@medicalcenter.org"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="signup-password">Password (Minimum 6 Characters)</label>
              <div className="input-with-icon">
                <Lock size={18} className="input-icon" />
                <input
                  id="signup-password"
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

            <div className="form-group">
              <label htmlFor="signup-confirm-password">Confirm Password</label>
              <div className="input-with-icon">
                <Lock size={18} className="input-icon" />
                <input
                  id="signup-confirm-password"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="auth-error-banner">
                <span>{error}</span>
              </div>
            )}

            <button type="submit" className="btn-auth-submit">
              <span>Complete Demo Registration</span>
              <ArrowRight size={17} />
            </button>
          </form>

          <div className="auth-footer-nav">
            <p>
              Already registered a session?{" "}
              <Link to="/login" className="auth-accent-link">
                Sign In Instead
              </Link>
            </p>
          </div>
        </div>

        <div className="auth-side-info">
          <h3>Why Register in Demo Mode?</h3>
          <ul className="security-points">
            <li>
              <ShieldCheck size={18} />
              <div>
                <strong>Personalized Dashboard</strong>
                <p>Track your local prediction history and confidence scores.</p>
              </div>
            </li>
            <li>
              <CheckCircle2 size={18} />
              <div>
                <strong>Privacy By Design</strong>
                <p>All session activity remains on your machine.</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
