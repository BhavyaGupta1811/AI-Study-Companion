import { Link } from "react-router-dom";
import { FaBars, FaGraduationCap, FaTimes } from "react-icons/fa";

import { useAuth } from "../context/AuthContext";

import "../styles/Navbar.css";
import { useState } from "react";

function Navbar() {
  
  const [menuOpen, setMenuOpen] = useState(false);
  
  const { user } = useAuth();

  // Navbar is only for guests.
  if (user) return null;

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <FaGraduationCap />
        <span>FocusFlow</span>
      </Link>

      <button
        className="menu-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle Navigation"
      >
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>

      <div className={`nav-links ${menuOpen ? "active" : ""}`}>
        <Link to="/" onClick={() => setMenuOpen(false)}>
          Home
        </Link>

        <Link to="/guide" onClick={() => setMenuOpen(false)}>
          How It Works
        </Link>

        <Link to="/login" onClick={() => setMenuOpen(false)}>
          Login
        </Link>

        <Link to="/register" onClick={() => setMenuOpen(false)}>
          Register
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
