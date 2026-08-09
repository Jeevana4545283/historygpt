import { BrowserRouter, Routes, Route } from "react-router-dom";
import ChatPage from "./pages/ChatPage";
import { HomePage } from "./pages/HomePage";
import { CommunityPage } from "./pages/CommunityPage";
import { WritePage } from "./pages/WritePage";
import { PostDetailPage } from "./pages/PostDetailPage";
import { ProfilePage } from "./pages/ProfilePage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { AnimatedBackground } from "./components/AnimatedBackground";
import { CinematicParticles } from "./components/CinematicParticles";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AnimatedBackground />
        <CinematicParticles />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/write" element={<WritePage />} />
          <Route path="/posts/:id" element={<PostDetailPage />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/chat" element={<ChatPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;