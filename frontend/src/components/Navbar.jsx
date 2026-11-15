import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  HeartPulse,
  Menu,
  X,
  User,
  LogOut,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import ApiStatusBadge from "./ApiStatusBadge";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate("/");
  };

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          <div className="brand-icon-wrapper">
            <HeartPulse size={22} className="brand-pulse-icon" />
          </div>
          <div className="brand-text">
            Onco<span className="brand-accent">Predict</span>
            <span className="brand-tag">ML 2.0</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav">
          <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
            Home
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
            About
          </NavLink>
          <NavLink to="/prediction" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
            Prediction Form
          </NavLink>
          <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
            Dashboard
          </NavLink>
        </nav>

        {/* Desktop Right Actions */}
        <div className="navbar-right">
          <ApiStatusBadge />

          {isAuthenticated ? (
            <div className="user-nav-dropdown">
              <Link to="/dashboard" className="user-profile-pill" onClick={closeMenu}>
                <span className="user-avatar">{user?.avatarInitial || "U"}</span>
                <span className="user-name">{user?.name || "Researcher"}</span>
              </Link>
              <button
                type="button"
                className="btn-logout"
                onClick={handleLogout}
                title="Sign Out"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn-signin">
                Sign In
              </Link>
              <Link to="/prediction" className="btn-get-started">
                <span>Run Model</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            type="button"
            className="mobile-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer">
          <nav className="mobile-nav-links">
            <NavLink to="/" end className="mobile-nav-link" onClick={closeMenu}>
              Home
            </NavLink>
            <NavLink to="/about" className="mobile-nav-link" onClick={closeMenu}>
              About Project
            </NavLink>
            <NavLink to="/prediction" className="mobile-nav-link" onClick={closeMenu}>
              Prediction Engine
            </NavLink>
            <NavLink to="/dashboard" className="mobile-nav-link" onClick={closeMenu}>
              Researcher Dashboard
            </NavLink>
          </nav>

          <div className="mobile-auth-section">
            {isAuthenticated ? (
              <div className="mobile-user-box">
                <div className="mobile-user-info">
                  <span className="user-avatar">{user?.avatarInitial}</span>
                  <div>
                    <p className="mobile-user-name">{user?.name}</p>
                    <p className="mobile-user-email">{user?.email}</p>
                  </div>
                </div>
                <button type="button" className="btn-mobile-logout" onClick={handleLogout}>
                  <LogOut size={16} /> Sign Out
                </button>
              </div>
            ) : (
              <div className="mobile-auth-actions">
                <Link to="/login" className="mobile-btn-login" onClick={closeMenu}>
                  Sign In
                </Link>
                <Link to="/signup" className="mobile-btn-signup" onClick={closeMenu}>
                  Create Demo Account
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
