import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import {
  FaClock,
  FaFire,
  FaBookOpen,
  FaChartLine,
  FaPlay,
  FaStop,
} from "react-icons/fa";
import { FaBullseye } from "react-icons/fa";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { formatName } from "../utils/formatName";

import "../styles/Dashboard.css";
import "../styles/StudySession.css";
import StudyReminder from "../components/StudyReminder";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [startingSession, setStartingSession] = useState(false);
  const [endingSession, setEndingSession] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);
  const [activeSession, setActiveSession] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [showReminder, setShowReminder] = useState(false);
  const [studyDuration, setStudyDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [warnings, setWarnings] = useState([]);

  useEffect(() => {
    if (user) {
      getDashboard();
    }
  }, [user]);

  useEffect(() => {
    if (!activeSession) return;

    const interval = setInterval(() => {
      const baseTime = activeSession.onBreak
        ? activeSession.breakStartedAt
        : activeSession.currentStudyStartedAt;

      const seconds = Math.floor((Date.now() - new Date(baseTime)) / 1000);

      setElapsed(seconds);
    }, 1000);

    return () => clearInterval(interval);
  }, [activeSession]);

  const getDashboard = async () => {
    try {
      setLoading(true);

      const [dashboardResponse, activeSessionResponse, warningsResponse] =
        await Promise.all([
          api.get("/dashboard"),
          api.get("/study-sessions/active"),
          api.get("/messages/warnings"),
        ]);
      setWarnings(warningsResponse.data.warnings);

      setDashboard(dashboardResponse.data.dashboard);

      setSessionActive(!!activeSessionResponse.data.session);

      setActiveSession(activeSessionResponse.data.session || null);
    } catch (error) {
      setSessionActive(false);
      setActiveSession(null);

      toast.error(error.response?.data?.message || "Failed to load dashboard.");
    } finally {
      setLoading(false);
    }
  };

  const refreshActiveSession = async () => {
    try {
      const response = await api.get("/study-sessions/active");

      setActiveSession(response.data.session || null);

      setSessionActive(!!response.data.session);
    } catch {}
  };

  const startStudySession = async () => {
    if (startingSession || sessionActive) return;

    try {
      setStartingSession(true);

      const response = await api.post("/study-sessions/start", {
        studyDuration,
        breakDuration,
      });

      toast.success(response.data.message);

      await getDashboard();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to start session.");
    } finally {
      setStartingSession(false);
    }
  };

  const endStudySession = async () => {
    if (endingSession || !sessionActive) return;

    try {
      setEndingSession(true);

      const response = await api.post("/study-sessions/end");

      toast.success(response.data.message);

      await getDashboard();
      setShowReminder(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to end session.");
    } finally {
      setEndingSession(false);
    }
  };

  const sendWarning = async () => {
    try {
      await api.post("/study-sessions/reminder");

      toast.warning(
        "Your accountability partner has been notified because you ignored the reminder.",
      );

      setShowReminder(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send warning.");
    }
  };

  const greeting = useMemo(() => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good Morning";

    if (hour < 17) return "Good Afternoon";

    return "Good Evening";
  }, []);

  const liveTimer = useMemo(() => {
    const totalSeconds =
      (activeSession?.onBreak
        ? activeSession.breakDuration
        : activeSession?.studyDuration || 25) * 60;

    const remaining = Math.max(0, totalSeconds - elapsed);

    const hrs = String(Math.floor(remaining / 3600)).padStart(2, "0");

    const mins = String(Math.floor((remaining % 3600) / 60)).padStart(2, "0");

    const secs = String(remaining % 60).padStart(2, "0");

    return `${hrs}:${mins}:${secs}`;
  }, [elapsed, activeSession]);

  useEffect(() => {
    if ("Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission();
      }
    }
  }, []);

  

  useEffect(() => {
    if (!activeSession) return;

    const interval = setInterval(() => {
      refreshActiveSession();
    }, 5000);

    return () => clearInterval(interval);
  }, [activeSession]);

  useEffect(() => {
    if (!activeSession || !activeSession.onBreak) {
      setShowReminder(false);
      return;
    }

    const interval = setInterval(() => {
      const breakMinutes = Math.floor(
        (Date.now() - new Date(activeSession.breakStartedAt)) / (1000 * 60),
      );

      if (breakMinutes >= activeSession.breakDuration) {
        setShowReminder(true);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [activeSession]);

  const previousBreakState = useRef(false);

  useEffect(() => {
    if (!activeSession) return;

    if (activeSession.onBreak && previousBreakState.current === false) {
      toast.info("☕ Time for a break!");

      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("FocusFlow", {
          body: "Time for a break ☕",
        });
      }
    }

    if (!activeSession.onBreak && previousBreakState.current === true) {
      toast.success("📚 Break over!");

      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("FocusFlow", {
          body: "Break over! Time to study.",
        });
      }
    }

    previousBreakState.current = activeSession.onBreak;
  }, [activeSession]);

  if (loading || !dashboard) {
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
          <h1>
            {greeting}, {formatName(user?.name)} 👋
          </h1>

          <p>Keep your streak alive and achieve today's study goal.</p>
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

      <div className="dashboard-grid">
        <div className="goal-card">
          <div className="goal-header">
            <FaBullseye />
            <h2>Today's Goal</h2>
          </div>

          <h3>
            {dashboard.todayStudyHours} / {dashboard.dailyTargetHours} hrs
          </h3>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${dashboard.goalProgress}%` }}
            />
          </div>

          <p>
            {dashboard.goalCompleted
              ? "🎉 Daily Goal Completed"
              : `${dashboard.goalProgress}% Completed`}
          </p>
        </div>

        <div className="weekly-card">
          <h2>Weekly Activity</h2>

          <div className="weekly-bars">
            {dashboard.weeklyActivity.map((day) => (
              <div key={day.day} className="bar-column">
                <div
                  className="bar"
                  style={{
                    height: `${Math.max(day.hours * 22, 10)}px`,
                  }}
                />

                <span>{day.day}</span>
              </div>
            ))}
          </div>

          <p className="average-study">
            Avg Daily Study : {dashboard.averageDailyStudy} hrs
          </p>
        </div>
      </div>

      {sessionActive && activeSession && (
        <div className="live-session-card">
          <h2>
            {activeSession.onBreak
              ? "☕ Break Time"
              : "🟢 Study Session Running"}
          </h2>

          <div className="live-time">{liveTimer}</div>

          <p>
            Study {activeSession.studyDuration} min • Break{" "}
            {activeSession.breakDuration} min
          </p>

          <p>
            {activeSession.onBreak
              ? "Relax for a while. Resume studying when your break ends."
              : "Stay focused. Every minute counts."}
          </p>
        </div>
      )}
      {!sessionActive && (
        <div className="pomodoro-card">
          <h2>Pomodoro Settings</h2>

          <div className="pomodoro-inputs">
            <div>
              <label>Study (minutes)</label>

              <input
                type="number"
                min="15"
                max="180"
                value={studyDuration}
                onChange={(e) => setStudyDuration(Number(e.target.value))}
              />
            </div>

            <div>
              <label>Break (minutes)</label>

              <input
                type="number"
                min="1"
                max="60"
                value={breakDuration}
                onChange={(e) => setBreakDuration(Number(e.target.value))}
              />
            </div>
          </div>
        </div>
      )}

      <div className="quick-actions">
        <h2>Quick Actions</h2>

        <div className="action-buttons">
          <button
            className="action-btn start-btn"
            onClick={startStudySession}
            disabled={sessionActive || startingSession}
          >
            <FaPlay />
            {startingSession ? " Starting..." : " Start Study"}
          </button>

          <button
            className="action-btn end-btn"
            onClick={endStudySession}
            disabled={!sessionActive || endingSession}
          >
            <FaStop />
            {endingSession ? " Ending..." : " End Study"}
          </button>
        </div>
      </div>

      <div className="recent-section">
        <h2>Recent Study Sessions</h2>

        {dashboard.recentSessions?.length === 0 ? (
          <div className="empty-card">
            <p>No study sessions completed yet.</p>
          </div>
        ) : (
          <div className="session-list">
            {dashboard.recentSessions?.map((session) => (
              <div className="session-card" key={session._id}>
                <div>
                  <h3>{session.duration} minutes</h3>

                  <p>
                    {new Date(session.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>

                <span className="completed-badge">Completed</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="recent-section">
        <h2>Accountability Alerts</h2>

        {warnings.length === 0 ? (
          <div className="empty-card">
            <p>No alerts received.</p>
          </div>
        ) : (
          <div className="session-list">
            {warnings.map((warning) => (
              <div className="session-card" key={warning._id}>
                <div>
                  <h3>{warning.sender.name}</h3>
                  <p>{warning.text}</p>
                </div>

                <button
                  className="action-btn"
                  onClick={() => {
                    setWarnings((prev) =>
                      prev.filter((w) => w._id !== warning._id),
                    );

                    navigate(`/chat?partner=${warning.sender._id}`);
                  }}
                >
                  Open Chat
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <StudyReminder
        open={showReminder}
        onContinue={async () => {
          setShowReminder(false);

          try {
            await api.post("/study-sessions/continue");
            await refreshActiveSession();
          } catch (error) {
            console.error(error);
          }
        }}
        onEnd={async () => {
          await endStudySession();
          await getDashboard();
          setShowReminder(false);
        }}
        onTimeout={sendWarning}
      />
    </div>
  );
}

export default Dashboard;
