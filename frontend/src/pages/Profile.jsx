import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import api from "../services/api";
import { formatName } from "../utils/formatName";
import { useAuth } from "../context/AuthContext";
import "../styles/Profile.css";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    college: "",
    course: "",
    year: "",
    studyGoal: "",
    dailyStudyTarget: "",
    accountabilityPartner: "",
  });

  const [saving, setSaving] = useState(false);
  const [partnerCode, setPartnerCode] = useState("");
  const [connecting, setConnecting] = useState(false);
  const { setUser: setAuthUser } = useAuth();

  useEffect(() => {
    getProfile();
  }, []);

  async function getProfile() {
    try {
      const response = await api.get("/users/profile");
      setUser(response.data.user);
      setFormData({
        name: response.data.user.name || "",
        bio: response.data.user.bio || "",
        college: response.data.user.college || "",
        course: response.data.user.course || "",
        year: response.data.user.year || "",
        studyGoal: response.data.user.studyGoal || "",
        dailyStudyTarget: response.data.user.dailyStudyTarget || "",
        accountabilityPartner:
          response.data.user.accountabilityPartner?._id || "",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="profile-page">
        <h2>Loading Profile...</h2>
      </div>
    );
  }

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function saveProfile() {
    try {
      setSaving(true);

      const dataToSend = {
        ...formData,
      };

      if (!dataToSend.accountabilityPartner) {
        delete dataToSend.accountabilityPartner;
      }

      if (!dataToSend.year) {
        delete dataToSend.year;
      }

      const response = await api.put("/users/profile", dataToSend);
      toast.success(response.data.message);

      setUser(response.data.user);
      setAuthUser(response.data.user);
      setFormData({
        name: response.data.user.name || "",
        bio: response.data.user.bio || "",
        college: response.data.user.college || "",
        course: response.data.user.course || "",
        year: response.data.user.year || "",
        studyGoal: response.data.user.studyGoal || "",
        dailyStudyTarget: response.data.user.dailyStudyTarget || "",
        accountabilityPartner:
          response.data.user.accountabilityPartner?._id || "",
      });

      setShowModal(false);
    } catch (error) {
      if (error.response?.data?.errors) {
        toast.error(error.response.data.errors[0].msg);
      } else {
        toast.error(
          error.response?.data?.message || "Failed to update profile",
        );
      }
    } finally {
      setSaving(false);
    }
  }

  async function connectPartner() {
    if (!partnerCode.trim()) {
      return toast.error("Enter a partner code");
    }

    try {
      setConnecting(true);

      const response = await api.post("/users/connect-partner", {
        partnerCode,
      });

      toast.success(response.data.message);

      setUser(response.data.user);
      setAuthUser(response.data.user);

      setPartnerCode("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Connection failed");
    } finally {
      setConnecting(false);
    }
  }
  return (
    <div className="profile-page">
      <div className="profile-card">
        <img
          src={user.profilePicture}
          alt={user.name}
          className="profile-image"
        />

        <h1>{formatName(user.name)}</h1>

        <p className="profile-email">{user.email}</p>

        <div className="partner-code-card">
          <span>Your Partner Code</span>

          <div className="partner-code-box">
            <h2>{user.partnerCode}</h2>

            <button
              onClick={() => {
                navigator.clipboard.writeText(user.partnerCode);
                toast.success("Partner code copied");
              }}
            >
              Copy
            </button>
          </div>
        </div>

        <div className="profile-info">
          <div className="info-card">
            <span>College</span>
            <h3>{user.college || "Not Added"}</h3>
          </div>

          <div className="info-card">
            <span>Course</span>
            <h3>{user.course || "Not Added"}</h3>
          </div>

          <div className="info-card">
            <span>Year</span>
            <h3>{user.year || "Not Added"}</h3>
          </div>

          <div className="info-card">
            <span>Daily Target</span>
            <h3>{user.dailyStudyTarget} hrs</h3>
          </div>

          <div className="info-card full-width">
            <span>Study Goal</span>
            <h3>{user.studyGoal || "Not Added"}</h3>
          </div>

          <div className="info-card full-width">
            <span>Bio</span>
            <h3>{user.bio || "No bio added yet."}</h3>
          </div>

          <div className="partner-section">
            <h3>Connect Accountability Partner</h3>

            <div className="partner-input">
              <input
                type="text"
                placeholder="Enter Partner Code"
                value={partnerCode}
                onChange={(e) => setPartnerCode(e.target.value.toUpperCase())}
              />

              <button onClick={connectPartner} disabled={connecting}>
                {connecting ? "Connecting..." : "Connect"}
              </button>
            </div>

            <div className="connected-partner">
              <span>Connected Partner</span>

              <h2>
                {user.accountabilityPartner
                  ? formatName(user.accountabilityPartner.name)
                  : "Not Connected"}
              </h2>

              {user.accountabilityPartner && (
                <p>{user.accountabilityPartner.email}</p>
              )}
            </div>
          </div>
        </div>

        <button className="edit-btn" onClick={() => setShowModal(true)}>
          Edit Profile
        </button>
      </div>
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Profile</h2>

            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
            />

            <input
              name="college"
              value={formData.college}
              onChange={handleChange}
              placeholder="College"
            />

            <input
              name="course"
              value={formData.course}
              onChange={handleChange}
              placeholder="Course"
            />

            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              placeholder="Year"
            />

            <input
              type="number"
              name="dailyStudyTarget"
              value={formData.dailyStudyTarget}
              onChange={handleChange}
              placeholder="Daily Target"
            />

            <input
              name="studyGoal"
              value={formData.studyGoal}
              onChange={handleChange}
              placeholder="Study Goal"
            />

            <textarea
              rows="4"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Bio"
            />

            <div className="modal-buttons">
              <button
                className="cancel-btn"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>

              <button
                className="save-btn"
                onClick={saveProfile}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
