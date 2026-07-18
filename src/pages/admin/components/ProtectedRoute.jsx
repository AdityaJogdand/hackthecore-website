import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const API_BASE = `${import.meta.env.VITE_API_URL}/api`;
const ADMIN_LOGIN_SALT = import.meta.env.VITE_ADMIN_LOGIN_SALT;
const ADMIN_LOGIN_PATH = `/admin/login-${ADMIN_LOGIN_SALT}`;

export default function ProtectedRoute({ children }) {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    const token = sessionStorage.getItem("htc_admin_token");
    if (!token) {
      setStatus("fail");
      return;
    }

    fetch(`${API_BASE}/admin/verify`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((r) => r.json())
      .then((d) => setStatus(d.valid ? "ok" : "fail"))
      .catch(() => setStatus("fail"));
  }, []);

  if (status === "checking") {
    return (
      <div
        style={{
          background: "#0C0C0D",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontFamily: "Barlow, sans-serif",
            color: "rgba(255,255,255,0.3)",
            letterSpacing: "0.2em",
            fontSize: 12,
            textTransform: "uppercase",
          }}
        >
          Verifying access…
        </span>
      </div>
    );
  }

  return status === "ok" ? children : <Navigate to={ADMIN_LOGIN_PATH} replace />;
}