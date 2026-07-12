import { Link, useNavigate } from "react-router-dom";
import { FaGraduationCap } from "react-icons/fa";
import { toast } from "react-toastify";

import { useAuth } from "../context/AuthContext";
import api from "../services/api";

import "../styles/Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  async function handleLogout() {
    try {
      const response = await api.post("/auth/logout");

      setUser(null);

      toast.success(response.data.message);

      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  }

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <FaGraduationCap />
        <span>FocusFlow</span>
      </Link>

      <div className="nav-links">

        {user ? (
          <>
            <Link to="/">Home</Link>

            <Link to="/dashboard">Dashboard</Link>

            <Link to="/study">Study</Link>

            <Link to="/chat">Chat</Link>

            <Link to="/profile">Profile</Link>

            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <>
              <Link to="/">Home</Link>

              <Link to="/login">Login</Link>

              <Link to="/register">Register</Link>
            </>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
