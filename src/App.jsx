import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Herosection from "./components/Herosection";
import About from "./components/About";
import MarqueeSection from "./components/MarqueeSection";

import Events from "./pages/Events";
import Courses from "./pages/Courses";
import Hackathon from "./pages/HackathonRegistration";

function Home() {
  return (
    <>
      <Navbar />
      <Herosection />
      <About />
      <MarqueeSection />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/hackathon" element={<Hackathon />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;