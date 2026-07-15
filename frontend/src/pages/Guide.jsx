import {
  FaUserPlus,
  FaChartLine,
  FaBookOpen,
  FaUsers,
  FaBell,
  FaTrophy,
  FaRocket,
  FaLightbulb,
} from "react-icons/fa";

import "../styles/Guide.css";

function Guide() {
  const steps = [
    {
      icon: <FaUserPlus />,
      title: "Create Your Account",
      description:
        "Register on FocusFlow and complete your profile to start tracking your productivity journey.",
    },
    {
      icon: <FaChartLine />,
      title: "Explore Dashboard",
      description:
        "Your dashboard shows study hours, daily goals, streaks, weekly progress, and recent activity.",
    },
    {
      icon: <FaBookOpen />,
      title: "Start Study Sessions",
      description:
        "Use Pomodoro-based study sessions. Set study duration and break duration according to your preference.",
    },
    {
      icon: <FaBell />,
      title: "Stay Focused",
      description:
        "FocusFlow reminds you when your break ends and helps you maintain consistency.",
    },
    {
      icon: <FaUsers />,
      title: "Add Accountability Partner",
      description:
        "Connect with your study partner and motivate each other through dedicated study chat.",
    },
    {
      icon: <FaTrophy />,
      title: "Build Your Streak",
      description:
        "Complete sessions regularly, achieve daily goals, and improve your study habits.",
    },
  ];

  return (
    <div className="guide-page">
      <div className="guide-header">
        <h1>
          How to Use FocusFlow <FaRocket />
        </h1>

        <p>
          Follow these simple steps to manage your study routine, track
          progress, and stay accountable.
        </p>
      </div>

      <div className="guide-container">
        {steps.map((step, index) => (
          <div className="guide-card" key={index}>
            <div className="guide-icon">{step.icon}</div>

            <div>
              <h2>
                {index + 1}. {step.title}
              </h2>

              <p>{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="guide-tip">
        <h2>
          <FaLightbulb />
          Pro Tip
        </h2>

        <p>
          Consistency matters more than long study hours. Start small, stay
          focused, and let FocusFlow help you build better habits.
        </p>
      </div>
    </div>
  );
}

export default Guide;
