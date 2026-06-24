import { BrowserRouter, Routes, Route } from "react-router-dom";
import ChatPage from "./pages/ChatPage";
import { HomePage } from "./pages/HomePage";
import { AnimatedBackground } from "./components/AnimatedBackground";
import { CinematicParticles } from "./components/CinematicParticles";

function App() {
  return (
    <BrowserRouter>
      <AnimatedBackground />
      <CinematicParticles />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;