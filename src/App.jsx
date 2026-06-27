import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Herosection from "./components/Herosection";
import About from "./components/About";
import FeaturedEvents from "./components/FeaturedEvents";
import MarqueeSection from "./components/MarqueeSection";
import CreateEvent from "./pages/admin/CreateEvent";
import EditEvent from "./pages/admin/EditEvent";


import Events from "./pages/Events";
import Courses from "./pages/Courses";
import HackathonRegistration from "./pages/HackathonRegistration";
import MeetupRegistration from "./pages/MeetupRegistration";
import MerchStore from "./pages/MerchStore";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProtectedRoute from "./pages/admin/components/ProtectedRoute";
import OurPartners from "./components/OurPartners";

function Home() {
  return (
    <>
      <Navbar />
      <Herosection />
      <FeaturedEvents />
      {/* <About /> */}
      <OurPartners />
      <MarqueeSection />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"  element={<Home />} />
        <Route path="/events"  element={<Events />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/MerchStore" element={<MerchStore />} />
        <Route path="/events/hackathon/:id" element={<HackathonRegistration />} />
        <Route path="/events/meetup/:id" element={<MeetupRegistration />} />

        {/* Admin — protected */}
        <Route path="/admin/login"     element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/create-event" element={
          <ProtectedRoute>
            <CreateEvent />
          </ProtectedRoute>
        } />
        <Route path="/admin/edit-event/:id" element={
          <ProtectedRoute>
            <EditEvent />
          </ProtectedRoute>
        } />

      </Routes>
    </BrowserRouter>
  );
}

export default App;