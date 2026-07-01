import { createContext, useContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext(null);

const API_BASE = "http://localhost:4000/api/auth";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const queryToken = params.get("token");
    if (queryToken) {
      localStorage.setItem("htc_token", queryToken);
      window.history.replaceState({}, document.title, window.location.pathname);
      return queryToken;
    }
    return localStorage.getItem("htc_token") || null;
  });
  const [loading, setLoading] = useState(true);

  // ── Persist / clear token ──
  const saveToken = useCallback((t) => {
    setToken(t);
    if (t) {
      localStorage.setItem("htc_token", t);
    } else {
      localStorage.removeItem("htc_token");
    }
  }, []);

  // ── Fetch current user from token on mount ──
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    fetch(`${API_BASE}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Invalid token");
        return res.json();
      })
      .then((data) => {
        setUser(data.user);
      })
      .catch(() => {
        // Token expired or invalid — clear it
        saveToken(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, [token, saveToken]);

  // ── Register ──
  const register = async (name, email, password) => {
    const res = await fetch(`${API_BASE}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Registration failed.");
    }

    saveToken(data.token);
    setUser(data.user);
    return data;
  };

  // ── Login ──
  const login = async (email, password) => {
    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Login failed.");
    }

    saveToken(data.token);
    setUser(data.user);
    return data;
  };

  // ── Google OAuth ──
  const loginWithGoogle = async (credential) => {
    const res = await fetch(`${API_BASE}/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credential }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Google login failed.");
    }

    saveToken(data.token);
    setUser(data.user);
    return data;
  };

  // ── Logout ──
  const logout = () => {
    saveToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        loginWithGoogle,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}

export default AuthContext;
