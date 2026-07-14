import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

import "../styles/Auth.css";

function Register() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    college: "",
    course: "",
    year: "",
    dailyStudyTarget: 2,
    studyGoal: "",
    bio: "",
  });

  const handleChange = ({ target }) => {
    setFormData((prev) => ({
      ...prev,
      [target.name]: target.value,
    }));
  };

  const getPasswordStrength = (password) => {
    let score = 0;

    if (password.length >= 6) score++;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) {
      return {
        width: 30,
        color: "#ef4444",
        label: "Weak",
      };
    }

    if (score <= 4) {
      return {
        width: 65,
        color: "#f59e0b",
        label: "Medium",
      };
    }

    return {
      width: 100,
      color: "#22c55e",
      label: "Strong",
    };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    const name = formData.name.trim();
    const email = formData.email.trim().toLowerCase();
    const password = formData.password;

    if (!name || !email || !password) {
      return toast.error("Please fill all fields.");
    }

    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters.");
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/register", {
        name,
        email,
        password,
        role: formData.role,
        college: formData.college.trim(),
        course: formData.course.trim(),
        year: formData.year || undefined,
        dailyStudyTarget: Number(formData.dailyStudyTarget),
        studyGoal: formData.studyGoal.trim(),
        bio: formData.bio.trim(),
      });

      setUser(response.data.user);

      toast.success(response.data.message);

      navigate("/", { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>

        <p>Join FocusFlow and start your productive journey.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>

            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              autoComplete="name"
              required
              disabled={loading}
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              autoComplete="email"
              required
              disabled={loading}
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Role</label>

            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="student">Student</option>
              <option value="guardian">Guardian</option>
            </select>
          </div>

          <div className="form-group">
            <label>College</label>

            <input
              name="college"
              value={formData.college}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Course</label>

            <input
              name="course"
              value={formData.course}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Year</label>

            <input
              type="number"
              name="year"
              min="1"
              max="6"
              value={formData.year}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Daily Study Target (hrs)</label>

            <input
              type="number"
              name="dailyStudyTarget"
              min="1"
              max="24"
              value={formData.dailyStudyTarget}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Study Goal</label>

            <input
              name="studyGoal"
              value={formData.studyGoal}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Bio</label>

            <textarea
              rows="4"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Password</label>

            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create a password"
                autoComplete="new-password"
                required
                disabled={loading}
                value={formData.password}
                onChange={handleChange}
              />

              <button
                type="button"
                className="password-btn"
                onClick={() => setShowPassword((prev) => !prev)}
                disabled={loading}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {formData.password && (
              <div className="password-strength">
                <div className="strength-track">
                  <div
                    className="strength-fill"
                    style={{
                      width: `${passwordStrength.width}%`,
                      background: passwordStrength.color,
                    }}
                  />
                </div>

                <span
                  className="strength-label"
                  style={{ color: passwordStrength.color }}
                >
                  {passwordStrength.label}
                </span>
              </div>
            )}
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
