import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Study from "./pages/Study";
import Chat from "./pages/Chat";
import Navbar from "./components/Navbar";
import Profile from "./pages/Profile";
import "./styles/App.css";
import Sidebar from "./components/Sidebar";
import { useAuth } from "./context/AuthContext";
function App() {
  const { user } = useAuth();
  return (
    <>
      {user ? <Sidebar /> : <Navbar />}

      <div className={user ? "app-content" : ""}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Private Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/study" element={<Study />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
