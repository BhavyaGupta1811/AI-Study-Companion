import { useEffect, useState } from "react";
import "../styles/StudySession.css";

function StudyReminder({ open, countdown = 15, onContinue, onEnd, onTimeout }) {
  const [timeLeft, setTimeLeft] = useState(countdown);

  useEffect(() => {
    if (!open) return;

    setTimeLeft(countdown);

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);

          onTimeout?.();

          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [open]);

  if (!open) return null;

  return (
    <div className="reminder-overlay">
      <div className="reminder-card">
        <h2>⚠ Are you still studying?</h2>

        <p>We haven't detected any activity recently.</p>

        <h1>{timeLeft}</h1>

        <div className="reminder-buttons">
          <button onClick={onContinue}>Continue Studying</button>

          <button onClick={onEnd}>End Session</button>
        </div>
      </div>
    </div>
  );
}

export default StudyReminder;
