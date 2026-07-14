import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { MdRocketLaunch } from "react-icons/md";

import "../styles/Hero.css";

function Hero() {
  return (
    <section className="hero">
      <div className="hero-left">
        <span className="hero-tag">
          <MdRocketLaunch />
          <span>Smart Study • Better Consistency</span>
        </span>

        <h1>
          Stay Focused.
          <br />
          Stay Consistent.
        </h1>

        <p>
          FocusFlow helps students track study sessions, achieve daily goals,
          stay accountable with their study partners, and build productive study
          habits—all in one place.
        </p>

        <div className="hero-buttons">
          <Link to="/register" className="primary-btn" aria-label="Get Started">
            Get Started
            <FaArrowRight />
          </Link>

          <Link to="/login" className="secondary-btn" aria-label="Login">
            Login
          </Link>
        </div>
      </div>

      <div className="hero-right">
        <div className="hero-card">
          <h2>Today's Progress</h2>

          <div className="progress-circle" aria-label="Today's study progress">
            <span>75%</span>
          </div>

          <p>3 of 4 study hours completed</p>
        </div>
      </div>
    </section>
  );
}

export default Hero;
