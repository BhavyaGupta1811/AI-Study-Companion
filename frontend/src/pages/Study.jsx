import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaClock, FaBookOpen, FaChartLine, FaPlayCircle } from "react-icons/fa";

import api from "../services/api";

import "../styles/Study.css";

function Study() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalHours: 0,
    totalSessions: 0,
    activeSessions: 0,
  });
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    getSessions();
  }, []);

  async function getSessions() {
    try {
      const response = await api.get("/study-sessions");
      const allSessions = response.data.sessions;

      setSessions(allSessions);

      const completed = allSessions.filter(
        (session) => session.status === "completed",
      );

      const active = allSessions.filter(
        (session) => session.status === "active",
      );

      const totalMinutes = completed.reduce(
        (sum, session) => sum + session.duration,
        0,
      );

      setStats({
        totalHours: (totalMinutes / 60).toFixed(1),
        totalSessions: completed.length,
        activeSessions: active.length,
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load sessions"
      );
    } finally {
      setLoading(false);
    }
  }

  const filteredSessions = sessions.filter((session) => {
    const statusMatch = filter === "all" || session.status === filter;

    const searchText = `${session.duration} ${new Date(
      session.createdAt,
    ).toLocaleDateString()}`.toLowerCase();

    const searchMatch = searchText.includes(search.toLowerCase());

    return statusMatch && searchMatch;
  });

  if (loading) {
    return (
      <div className="study-page">
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div className="study-page">
      <div className="study-header">
        <h1>Study History</h1>
        <p>Your completed study sessions.</p>
      </div>

      <div className="study-stats">
        <div className="study-stat-card">
          <FaChartLine />

          <h2>{stats.totalHours}</h2>

          <p>Total Hours</p>
        </div>

        <div className="study-stat-card">
          <FaBookOpen />

          <h2>{stats.totalSessions}</h2>

          <p>Completed</p>
        </div>

        <div className="study-stat-card">
          <FaPlayCircle />

          <h2>{stats.activeSessions}</h2>

          <p>Active</p>
        </div>
      </div>

      <div className="study-filters">
        <button
          className={filter === "all" ? "active-filter" : ""}
          onClick={() => setFilter("all")}
        >
          All
        </button>

        <button
          className={filter === "completed" ? "active-filter" : ""}
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>

        <button
          className={filter === "active" ? "active-filter" : ""}
          onClick={() => setFilter("active")}
        >
          Active
        </button>
      </div>

      <div className="study-search">
        <input
          type="text"
          placeholder="Search by date or duration..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {sessions.length === 0 ? (
        <div className="empty-card">No study sessions found.</div>
      ) : (
        <div className="study-list">
          {sessions.map((session) => (
            <div className="study-card" key={session._id}>
              <div className="study-left">
                <FaClock className="study-icon" />

                <div>
                  <h3>{session.duration} Minutes</h3>

                  <p>
                    {new Date(session.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <span className={session.status}>{session.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Study;