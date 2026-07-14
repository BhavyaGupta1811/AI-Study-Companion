import { useEffect, useState, useMemo, useRef } from "react";
import { toast } from "react-toastify";
import {
  FaClock,
  FaBookOpen,
  FaChartLine,
  FaPlayCircle,
  FaPlay,
  FaStop,
} from "react-icons/fa";

import api from "../services/api";
import "../styles/Study.css";
import "../styles/StudySession.css";
import StudyReminder from "../components/StudyReminder";

function Study() {
  const [sessions, setSessions] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [activeSession, setActiveSession] = useState(null);

  const [showReminder, setShowReminder] = useState(false);

  const lastActivity = useRef(Date.now());
  const [elapsed, setElapsed] = useState(0);
  const [loading, setLoading] = useState(true);

  const [startingSession, setStartingSession] = useState(false);
  const [endingSession, setEndingSession] = useState(false);

  const [stats, setStats] = useState({
    totalHours: 0,
    totalSessions: 0,
    activeSessions: 0,
  });

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadStudyData();
  }, []);

  useEffect(() => {
    if (!activeSession) {
      setElapsed(0);
      return;
    }

    const interval = setInterval(() => {
      const seconds = Math.floor(
        (Date.now() - new Date(activeSession.startTime)) / 1000,
      );

      setElapsed(seconds);
    }, 1000);

    return () => clearInterval(interval);
  }, [activeSession]);

  async function loadStudyData() {
    try {
      setLoading(true);

      const [sessionsResponse, analyticsResponse, activeSessionResponse] =
        await Promise.all([
          api.get("/study-sessions"),
          api.get("/study-sessions/analytics"),
          api.get("/study-sessions/active"),
        ]);

      const allSessions = sessionsResponse.data.sessions || [];

      setSessions(allSessions);
      setAnalytics(analyticsResponse.data.analytics);

      setActiveSession(activeSessionResponse.data.session || null);

      if (activeSessionResponse.data.session) {
        lastActivity.current = Date.now();
      }

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
        error.response?.data?.message || "Failed to load study sessions",
      );
    } finally {
      setLoading(false);
    }
  }

  const startStudySession = async () => {
    if (startingSession || activeSession) return;

    try {
      setStartingSession(true);

      const response = await api.post("/study-sessions/start");

      toast.success(response.data.message);

      lastActivity.current = Date.now();

      await loadStudyData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to start session");
    } finally {
      setStartingSession(false);
    }
  };

  const endStudySession = async () => {
    if (endingSession || !activeSession) return;

    try {
      setEndingSession(true);

      const response = await api.post("/study-sessions/end");

      toast.success(response.data.message);

      await loadStudyData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to end session");
    } finally {
      setEndingSession(false);
    }
  };

  const filteredSessions = sessions.filter((session) => {
    const statusMatch = filter === "all" || session.status === filter;

    const searchText = `${session.duration} ${new Date(
      session.createdAt,
    ).toLocaleDateString("en-IN")}`.toLowerCase();

    const searchMatch = searchText.includes(search.toLowerCase());

    return statusMatch && searchMatch;
  });

  const liveTimer = useMemo(() => {
    const hrs = String(Math.floor(elapsed / 3600)).padStart(2, "0");

    const mins = String(Math.floor((elapsed % 3600) / 60)).padStart(2, "0");

    const secs = String(elapsed % 60).padStart(2, "0");

    return `${hrs}:${mins}:${secs}`;
  }, [elapsed]);

  useEffect(() => {
    if (!activeSession) return;

    const updateActivity = () => {
      lastActivity.current = Date.now();
    };

    window.addEventListener("mousemove", updateActivity);
    window.addEventListener("keydown", updateActivity);
    window.addEventListener("scroll", updateActivity);
    window.addEventListener("click", updateActivity);

    return () => {
      window.removeEventListener("mousemove", updateActivity);
      window.removeEventListener("keydown", updateActivity);
      window.removeEventListener("scroll", updateActivity);
      window.removeEventListener("click", updateActivity);
    };
  }, [activeSession]);

  useEffect(() => {
    if (!activeSession) return;

    const interval = setInterval(() => {
      const inactiveFor = Date.now() - lastActivity.current;

      if (inactiveFor > 60000 && !showReminder) {
        setShowReminder(true);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [activeSession]);

  if (loading) {
    return (
      <div className="study-page">
        <h2>Loading...</h2>
      </div>
    );
  }

  const sendWarning = async () => {
    try {
      const response = await api.post("/study-sessions/reminder");

      toast.warning(response.data.message);

      setShowReminder(false);
      lastActivity.current = Date.now();

      // If session ended on backend later
      await loadStudyData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send reminder.");
    }
  };

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

      {analytics && (
        <div className="analytics-grid">
          <div className="analytics-card">
            <h3>{analytics.averageSession} min</h3>
            <p>Average Session</p>
          </div>

          <div className="analytics-card">
            <h3>{analytics.longestSession} min</h3>
            <p>Longest Session</p>
          </div>

          <div className="analytics-card">
            <h3>{analytics.weeklyHours} hrs</h3>
            <p>Last 7 Days</p>
          </div>

          <div className="analytics-card">
            <h3>{analytics.monthlyHours} hrs</h3>
            <p>Last 30 Days</p>
          </div>

          <div className="analytics-card">
            <h3>{analytics.currentStreak} 🔥</h3>
            <p>Current Streak</p>
          </div>
        </div>
      )}

      {activeSession && (
        <div className="live-session-card">
          <h2>🟢 Study Session Running</h2>

          <div className="live-time">{liveTimer}</div>

          <p>Stay focused. Every minute counts.</p>
        </div>
      )}

      <div className="quick-actions">
        <h2>Study Controls</h2>

        <div className="action-buttons">
          <button
            className="action-btn start-btn"
            onClick={startStudySession}
            disabled={!!activeSession || startingSession}
          >
            <FaPlay />

            {startingSession ? " Starting..." : " Start Study"}
          </button>

          <button
            className="action-btn end-btn"
            onClick={endStudySession}
            disabled={!activeSession || endingSession}
          >
            <FaStop />

            {endingSession ? " Ending..." : " End Study"}
          </button>
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

      {filteredSessions.length === 0 ? (
        <div className="empty-card">No study sessions found.</div>
      ) : (
        <div className="study-list">
          {filteredSessions.map((session) => (
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
      <StudyReminder
        open={showReminder}
        onContinue={() => {
          lastActivity.current = Date.now();
          setShowReminder(false);
        }}
        onEnd={endStudySession}
        onTimeout={sendWarning}
      />
    </div>
  );
}

export default Study;
