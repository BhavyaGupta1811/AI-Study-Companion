import { Link } from "react-router-dom";
import { FaGraduationCap } from "react-icons/fa";

import { useAuth } from "../context/AuthContext";

import "../styles/Navbar.css";

function Navbar() {
  const { user } = useAuth();

  // Navbar is only for guests.
  if (user) return null;

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <FaGraduationCap />
        <span>FocusFlow</span>
      </Link>

      <div className="nav-links">
        <Link to="/">Home</Link>

        <Link to="/login">Login</Link>

        <Link to="/register">Register</Link>
      </div>
    </nav>
  );
}

export default Navbar;
