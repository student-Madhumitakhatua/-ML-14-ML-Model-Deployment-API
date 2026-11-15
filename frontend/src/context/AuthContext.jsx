import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

const DEMO_USER_KEY = "oncopredict_demo_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(DEMO_USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const login = (email, password) => {
    // Client-side demonstration mode
    const demoUser = {
      name: email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || "Research Clinician",
      email: email,
      role: "Clinical Researcher (Demo)",
      avatarInitial: email.charAt(0).toUpperCase() || "U",
      joinedDate: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      isDemo: true
    };
    setUser(demoUser);
    try {
      localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demoUser));
    } catch {
      // storage unavailable
    }
    return demoUser;
  };

  const signup = (name, email, password) => {
    const newUser = {
      name: name.trim() || "Clinical Researcher",
      email: email.trim(),
      role: "Guest Practitioner (Demo)",
      avatarInitial: (name.trim() || email).charAt(0).toUpperCase(),
      joinedDate: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      isDemo: true
    };
    setUser(newUser);
    try {
      localStorage.setItem(DEMO_USER_KEY, JSON.stringify(newUser));
    } catch {
      // storage unavailable
    }
    return newUser;
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(DEMO_USER_KEY);
    } catch {
      // storage unavailable
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        login,
        signup,
        logout,
        isDemoAuth: true
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
