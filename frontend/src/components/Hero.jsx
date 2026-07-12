import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { MdRocketLaunch } from "react-icons/md";

import "../styles/Hero.css";

function Hero() {
  return (
    <section className="hero">
      <div className="hero-left">
        <span className="hero-tag">
          <MdRocketLaunch /> Smart Study • Better Consistency
        </span>

        <h1>
          Stay Focused.
          <br />
          Stay Consistent.
        </h1>

        <p>
          FocusFlow helps students track study sessions, achieve daily goals,
          and stay accountable with their study partners—all in one place.
        </p>

        <div className="hero-buttons">
          <Link to="/register" className="primary-btn">
            Get Started
            <FaArrowRight />
          </Link>

          <Link to="/login" className="secondary-btn">
            Login
          </Link>
        </div>
      </div>

      <div className="hero-right">
        <div className="hero-card">
          <h3>Today's Progress</h3>

          <div className="progress-circle">
            <span>75%</span>
          </div>

          <p>3 of 4 study hours completed</p>
        </div>
      </div>
    </section>
  );
}

export default Hero;
