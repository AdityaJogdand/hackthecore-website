import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Herosection from "./components/Herosection";
import FeaturedEvents from "./components/FeaturedEvents";
import OurPartners from "./components/OurPartners";
import Footer from "./components/Footer";
import CreateEvent from "./pages/admin/CreateEvent";
import About from "./pages/AboutPage";
import EditEvent from "./pages/admin/EditEvent";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Events from "./pages/Events";
import Courses from "./pages/Courses";
import HackathonRegistration from "./pages/HackathonRegistration";
import MeetupRegistration from "./pages/MeetupRegistration";
import MerchStore from "./pages/MerchStore";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProtectedRoute from "./pages/admin/components/ProtectedRoute";
import { AuthProvider, useAuth } from "./context/AuthContext";
import GapHero from "./components/Gaphero";
import SmoothScrollProvider from "./components/SmoothScrollProvider";
import ScrollToTop from "./components/ScrollToTop";
import StatsReveal from "./components/StatsReveal";

// Salted admin login path — set VITE_ADMIN_LOGIN_SALT in your .env file.
// Falls back to a default so the app doesn't crash if the env var is missing,
// but you should always set your own value in .env (never commit the real one).
const ADMIN_LOGIN_SALT = import.meta.env.VITE_ADMIN_LOGIN_SALT || "x9k2p7q4z";
const ADMIN_LOGIN_PATH = `/admin/login-${ADMIN_LOGIN_SALT}`;

function Home() {
  return (
    <>
      <Herosection />
      <GapHero />
      <FeaturedEvents />
      <StatsReveal />
      <OurPartners />
      <Footer />
      
    </>
  );
}

function UserProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <div style={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center", background: "#FAFAF8" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ border: "4px solid #ddd", borderTop: "4px solid #000", borderRadius: "50%", width: "40px", height: "40px", animation: "spin 1s linear infinite", margin: "0 auto 10px" }} />
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          <span style={{ fontSize: "14px", color: "#666" }}>Verifying session...</span>
        </div>
      </div>
    );
  }
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? <Navigate to="/" replace /> : children;
}

// Layout wrapper — Navbar shown on all non-admin, non-auth pages
function AppLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
}

function App() {
  return (
    // SmoothScrollProvider owns a single Lenis instance for the entire app.
    // It must sit above BrowserRouter/Routes so it mounts once and never
    // gets torn down and recreated on every route change — that per-page
    // recreation was what forced a hard reload when navigating between pages.
    <SmoothScrollProvider>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Auth pages — no navbar */}
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />

            {/* Admin pages — no navbar */}
            <Route path={ADMIN_LOGIN_PATH} element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/create-event" element={<ProtectedRoute><CreateEvent /></ProtectedRoute>} />
            <Route path="/admin/edit-event/:id" element={<ProtectedRoute><EditEvent /></ProtectedRoute>} />

            {/* User pages — navbar included */}
            <Route path="/" element={
              <UserProtectedRoute>
                <AppLayout><Home /></AppLayout>
              </UserProtectedRoute>
            } />
            <Route path="/events" element={
              <UserProtectedRoute>
                <AppLayout><Events /></AppLayout>
              </UserProtectedRoute>
            } />
            <Route path="/aboutpage" element={
              <UserProtectedRoute>
                <AppLayout><About /></AppLayout>
              </UserProtectedRoute>
            } />

            <Route path="/courses" element={
              <UserProtectedRoute>
                <AppLayout><Courses /></AppLayout>
              </UserProtectedRoute>
            } />
            <Route path="/merchstore" element={
              <UserProtectedRoute>
                <AppLayout><MerchStore /></AppLayout>
              </UserProtectedRoute>
            } />
            <Route path="/events/hackathon/:id" element={
              <UserProtectedRoute>
                <AppLayout><HackathonRegistration /></AppLayout>
              </UserProtectedRoute>
            } />
            <Route path="/events/meetup/:id" element={
              <UserProtectedRoute>
                <AppLayout><MeetupRegistration /></AppLayout>
              </UserProtectedRoute>
            } />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </SmoothScrollProvider>
  );
}

export default App;