import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "../styles/Dashboard.css";
import { formatName } from "../utils/formatName";
import { FaClock, FaFire, FaBookOpen, FaChartLine, FaPlay, FaStop } from "react-icons/fa";
function Dashboard() {
  const { user } = useAuth();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startingSession, setStartingSession] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);

  useEffect(() => {
    getDashboard();
  }, []);

  async function getDashboard() {
    try {
      const response = await api.get("/dashboard");

      setDashboard(response.data.dashboard);
      try {
        await api.get("/study-sessions/active");
        setSessionActive(true);
      } catch {
        setSessionActive(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }

  async function startStudySession() {
    try {
      setStartingSession(true);

      const response = await api.post("/study-sessions/start");

      toast.success(response.data.message);

      await getDashboard();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to start session");
    } finally {
      setStartingSession(false);
    }
  }

  async function endStudySession() {
    try {
      const response = await api.post("/study-sessions/end");

      toast.success(response.data.message);

      await getDashboard();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to end session");
    }
  }

  if (loading) {
    return (
      <div className="dashboard">
        <h2>Loading Dashboard...</h2>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Welcome back, {formatName(user?.name)} 👋</h1>
          <p>Keep your streak alive and stay consistent today.</p>
        </div>
      </div>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <FaClock />
          </div>

          <h2>{dashboard.todayStudyHours} hrs</h2>

          <p>Today's Study</p>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaChartLine />
          </div>

          <h2>{dashboard.totalStudyHours} hrs</h2>

          <p>Total Study</p>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaBookOpen />
          </div>

          <h2>{dashboard.totalSessions}</h2>

          <p>Study Sessions</p>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaFire />
          </div>

          <h2>{dashboard.streak} 🔥</h2>

          <p>Current Streak</p>
        </div>
      </div>
      <div className="quick-actions">
        <h2>Quick Actions</h2>

        <div className="action-buttons">
          <button
            className="action-btn start-btn"
            onClick={startStudySession}
            disabled={sessionActive}
          >
            <FaPlay />
            Start Study
          </button>

          <button
            className="action-btn end-btn"
            onClick={endStudySession}
            disabled={!sessionActive}
          >
            <FaStop />
            End Study
          </button>
        </div>
      </div>
      <div className="recent-section">
        <h2>Recent Study Sessions</h2>

        {dashboard.recentSessions.length === 0 ? (
          <div className="empty-card">
            <p>No study sessions completed yet.</p>
          </div>
        ) : (
          <div className="session-list">
            {dashboard.recentSessions.map((session) => (
              <div className="session-card" key={session._id}>
                <div>
                  <h3>{session.duration} minutes</h3>
                  <p>{new Date(session.createdAt).toLocaleDateString()}</p>
                </div>

                <span className="completed-badge">Completed</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
