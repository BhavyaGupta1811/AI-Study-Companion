import { useEffect, useState, useRef } from "react";
import "../styles/StudySession.css";

function StudyReminder({ open, countdown = 15, onContinue, onEnd, onTimeout }) {
  const [timeLeft, setTimeLeft] = useState(countdown);
  const [disabled, setDisabled] = useState(false);

  const timeoutCalled = useRef(false);

  useEffect(() => {
    if (!open) {
      setTimeLeft(countdown);
      setDisabled(false);
      timeoutCalled.current = false;
      return;
    }

    setTimeLeft(countdown);
    setDisabled(false);
    timeoutCalled.current = false;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);

          if (!timeoutCalled.current) {
            timeoutCalled.current = true;
            setDisabled(true);
            onTimeout?.();
          }

          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [open, countdown, onTimeout]);

  const handleContinue = () => {
    if (disabled) return;

    setDisabled(true);
    onContinue?.();
  };

  const handleEnd = () => {
    if (disabled) return;

    setDisabled(true);
    onEnd?.();
  };

  if (!open) return null;

  return (
    <div className="reminder-overlay">
      <div className="reminder-card">
        <h2>⚠ Break Time Finished</h2>

        <p>Are you ready to continue studying?</p>

        <div className="reminder-countdown">{timeLeft}</div>

        <p>Ignoring this reminder will notify your accountability partner.</p>

        <div className="reminder-buttons">
          <button onClick={handleContinue} disabled={disabled}>
            Continue Studying
          </button>

          <button onClick={handleEnd} disabled={disabled}>
            End Session
          </button>
        </div>
      </div>
    </div>
  );
}

export default StudyReminder;
