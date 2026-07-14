import { FaBookOpen, FaComments, FaChartLine } from "react-icons/fa";

import "../styles/Features.css";

function Features() {
  return (
    <section className="features">
      <h2>Why Choose FocusFlow?</h2>

      <div className="feature-container">
        <article className="feature-card">
          <FaBookOpen className="feature-icon" />

          <h3>Study Tracking</h3>

          <p>Track every study session and build long-term consistency.</p>
        </article>

        <article className="feature-card">
          <FaChartLine className="feature-icon" />

          <h3>Progress Dashboard</h3>

          <p>Visualize your learning journey with detailed study statistics.</p>
        </article>

        <article className="feature-card">
          <FaComments className="feature-icon" />

          <h3>Partner Messaging</h3>

          <p>
            Stay connected with your accountability partner and remain
            motivated.
          </p>
        </article>
      </div>
    </section>
  );
}

export default Features;
