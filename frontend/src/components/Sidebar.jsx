import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  FaChartPie,
  FaBookOpen,
  FaComments,
  FaUser,
  FaSignOutAlt,
  FaBolt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { toast } from "react-toastify";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { formatName } from "../utils/formatName";

import "../styles/Sidebar.css";

function Sidebar() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const close = () => {
      if (window.innerWidth <= 768) {
        setMobileOpen(false);
      }
    };

    window.addEventListener("resize", close);

    return () => window.removeEventListener("resize", close);
  }, []);

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
    <>
      <button className="sidebar-menu-btn" onClick={() => setMobileOpen(true)}>
        <FaBars />
      </button>

      {mobileOpen && (
        <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />
      )}

      <aside
        className={`sidebar
          ${collapsed ? "collapsed" : ""}
          ${mobileOpen ? "open" : ""}`}
      >
        <div>
          <div className="sidebar-top">
            <div className="sidebar-logo">
              <FaBolt />
              {!collapsed && <span>FocusFlow</span>}
            </div>

            <button
              className="collapse-btn"
              onClick={() => {
                if (window.innerWidth <= 768) {
                  setMobileOpen(false);
                } else {
                  setCollapsed(!collapsed);
                }
              }}
            >
              {window.innerWidth <= 768 ? <FaTimes /> : <FaBars />}
            </button>
          </div>

          <nav>
            <NavLink to="/dashboard">
              <FaChartPie />
              {!collapsed && <span>Dashboard</span>}
            </NavLink>

            <NavLink to="/study">
              <FaBookOpen />
              {!collapsed && <span>Study</span>}
            </NavLink>

            <NavLink to="/chat">
              <FaComments />
              {!collapsed && <span>Chat</span>}
            </NavLink>

            <NavLink to="/profile">
              <FaUser />
              {!collapsed && <span>Profile</span>}
            </NavLink>
          </nav>
        </div>

        <div>
          {!collapsed && (
            <div className="sidebar-user">
              <img
                src={
                  user?.profilePicture ||
                  "https://ik.imagekit.io/2gnckpnjs/ffa31224f6efb03a7156cfea05b9e5ab.jpg"
                }
                alt="profile"
              />

              <div>
                <h4>{formatName(user?.name || "User")}</h4>
                <p>{user?.email}</p>
              </div>
            </div>
          )}

          <button className="sidebar-logout" onClick={handleLogout}>
            <FaSignOutAlt />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
