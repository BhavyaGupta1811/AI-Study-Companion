import { NavLink, useNavigate } from "react-router-dom";
import {
  FaChartPie,
  FaBookOpen,
  FaComments,
  FaUser,
  FaSignOutAlt,
  FaBolt,
} from "react-icons/fa";
import { toast } from "react-toastify";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

import "../styles/Sidebar.css";
import { formatName } from "../utils/formatName";

function Sidebar() {
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
    <aside className="sidebar">
      <div>
        <div className="sidebar-logo">
          <FaBolt />
          <span>FocusFlow</span>
        </div>

        <nav>
          <NavLink to="/dashboard">
            <FaChartPie />
            Dashboard
          </NavLink>

          <NavLink to="/study">
            <FaBookOpen />
            Study
          </NavLink>

          <NavLink to="/chat">
            <FaComments />
            Chat
          </NavLink>

          <NavLink to="/profile">
            <FaUser />
            Profile
          </NavLink>
        </nav>
      </div>

      <div className="sidebar-user">
        <img src={user.profilePicture} alt={formatName(user.name)} />

        <div>
          <h4>{formatName(user.name)}</h4>
          <p>{user.email}</p>
        </div>
      </div>

      <button className="sidebar-logout" onClick={handleLogout}>
        <FaSignOutAlt />
        Logout
      </button>
    </aside>
  );
}

export default Sidebar;
