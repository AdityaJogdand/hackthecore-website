import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Herosection from "./components/Herosection";
import About from "./components/About";
import MarqueeSection from "./components/MarqueeSection";

import Events from "./pages/Events";

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;