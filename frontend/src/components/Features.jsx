import { FaBookOpen, FaComments, FaChartLine } from "react-icons/fa";

import "../styles/Features.css";

function Features() {
  return (
    <section className="features">
      <h2>Why Choose FocusFlow?</h2>

      <div className="feature-container">
        <div className="feature-card">
          <FaBookOpen className="feature-icon" />
          <h3>Study Tracking</h3>
          <p>Track every study session and build consistency.</p>
        </div>

        <div className="feature-card">
          <FaChartLine className="feature-icon" />
          <h3>Dashboard</h3>
          <p>Visualize your learning progress with useful statistics.</p>
        </div>

        <div className="feature-card">
          <FaComments className="feature-icon" />
          <h3>Messaging</h3>
          <p>Stay connected with your accountability partner.</p>
        </div>
      </div>
    </section>
  );
}

export default Features;
