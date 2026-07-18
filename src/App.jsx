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
import MerchStore from "./pages/MerchStore";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProtectedRoute from "./pages/admin/components/ProtectedRoute";
import { AuthProvider, useAuth } from "./context/AuthContext";
import GapHero from "./components/Gaphero";
import SmoothScrollProvider from "./components/SmoothScrollProvider";
import ScrollToTop from "./components/ScrollToTop";
import StatsReveal from "./components/StatsReveal";
import ShowCase from "./pages/ShowCase";
import MarqueeSection from "./components/MarqueeSection";
import Community from "./pages/Community";
import VideoIntro from "./components/VideoIntro";
import EventDetail from "./pages/EventDetail";
import FAQ from "./components/FAQ";
import LegalPage from "./pages/LegalPage";
import HackTerms from "./pages/HackTerms";

// Salted admin login path — set VITE_ADMIN_LOGIN_SALT in your .env file.
// Falls back to a default so the app doesn't crash if the env var is missing,
// but you should always set your own value in .env (never commit the real one).
const ADMIN_LOGIN_SALT = import.meta.env.VITE_ADMIN_LOGIN_SALT;
const ADMIN_LOGIN_PATH = `/admin/login-${ADMIN_LOGIN_SALT}`;

function Home() {
  return (
    <>
      <VideoIntro />
      <Herosection />
      <GapHero />
      <FeaturedEvents />
      <StatsReveal />
      <MarqueeSection />
      <OurPartners />
      <FAQ />
      <Footer />
      
    </>
  );
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

            {/* User pages — publicly accessible */}
            <Route path="/" element={<AppLayout><Home /></AppLayout>} />
            <Route path="/events" element={<AppLayout><Events /></AppLayout>} />
            <Route path="/events/:id" element={<AppLayout><EventDetail /></AppLayout>} />
            <Route path="/aboutpage" element={<AppLayout><About /></AppLayout>} />
            <Route path="/courses" element={<AppLayout><Courses /></AppLayout>} />
            <Route path="/merchstore" element={<AppLayout><MerchStore /></AppLayout>} />
            <Route path="/showcase" element={<AppLayout><ShowCase /></AppLayout>} />
            <Route path="/community" element={<AppLayout><Community /></AppLayout>} />
            <Route path="/privacy" element={<AppLayout><LegalPage /></AppLayout>} />
            <Route path="/terms" element={<AppLayout><HackTerms /></AppLayout>} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </SmoothScrollProvider>
  );
}

export default App;