import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const ease = [0.22, 1, 0.36, 1];
const FONT = "Barlow, sans-serif";
const API_BASE = `${import.meta.env.VITE_API_URL}/api`;

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed.");
        return;
      }

      sessionStorage.setItem("htc_admin_token", data.token);
      navigate("/admin/dashboard", { replace: true });
    } catch {
      setError("Cannot reach server. Is it running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "#0C0C0D", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 20px" }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease }}
        style={{ width: "100%", maxWidth: 400 }}
      >
        {/* Logo / title */}
        <div style={{ marginBottom: 40, textAlign: "center" }}>
          <span style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,0,0.6)" }}>
            HackTheCore
          </span>
          <h1 style={{ fontFamily: FONT, fontWeight: 900, fontSize: "2rem", textTransform: "uppercase", letterSpacing: "-0.03em", color: "#fff", margin: "10px 0 0" }}>
            Admin Access
          </h1>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Username */}
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            <label style={{ fontFamily: FONT, fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)" }}>
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              autoComplete="username"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "14px 16px", fontFamily: FONT, fontSize: 15, color: "#fff", outline: "none" }}
              onFocus={e => e.target.style.borderColor = "rgba(255,255,0,0.5)"}
              onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
            />
          </div>

          {/* Password */}
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            <label style={{ fontFamily: FONT, fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)" }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "14px 16px", fontFamily: FONT, fontSize: 15, color: "#fff", outline: "none" }}
              onFocus={e => e.target.style.borderColor = "rgba(255,255,0,0.5)"}
              onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
            />
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{ fontFamily: FONT, fontSize: 13, color: "#ff6b6b", background: "rgba(255,100,100,0.08)", border: "1px solid rgba(255,100,100,0.2)", borderRadius: 8, padding: "10px 14px", margin: 0 }}
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            style={{ marginTop: 8, background: loading ? "rgba(255,255,0,0.4)" : "#FFFF00", color: "#0C0C0D", border: "none", borderRadius: 10, padding: "16px", fontFamily: FONT, fontWeight: 900, fontSize: 14, letterSpacing: "0.1em", textTransform: "uppercase", cursor: loading ? "not-allowed" : "pointer" }}
          >
            {loading ? "Verifying…" : "Sign in →"}
          </motion.button>
        </form>

        <p style={{ textAlign: "center", fontFamily: FONT, fontSize: 11, color: "rgba(255,255,255,0.15)", marginTop: 24 }}>
          This page is not publicly listed. Unauthorised access is logged.
        </p>
      </motion.div>
    </div>
  );
}