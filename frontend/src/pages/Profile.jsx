import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import api from "../services/api";
import { formatName } from "../utils/formatName";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

import "../styles/Profile.css";

function Profile() {
  const { setUser: setAuthUser } = useAuth(); 
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);

  const [saving, setSaving] = useState(false);
  const [connecting, setConnecting] = useState(false);

  const [partnerCode, setPartnerCode] = useState("");

  const [showPartnerCode, setShowPartnerCode] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    college: "",
    course: "",
    year: "",
    studyGoal: "",
    dailyStudyTarget: "",
    accountabilityPartners: [],
  });

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    try {
      setLoading(true);

      const response = await api.get("/users/profile");

      const profile = response.data.user;

      setUser(profile);

      setFormData({
        name: profile.name || "",
        bio: profile.bio || "",
        college: profile.college || "",
        course: profile.course || "",
        year: profile.year || "",
        studyGoal: profile.studyGoal || "",
        dailyStudyTarget: profile.dailyStudyTarget || "",
        accountabilityPartners: profile.accountabilityPartners || [],
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load profile.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <h2>Loading Profile...</h2>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-page">
        <h2>Unable to load profile.</h2>
      </div>
    );
  }

  const handleChange = ({ target }) => {
    setFormData((prev) => ({
      ...prev,
      [target.name]: target.value,
    }));
  };

  const saveProfile = async () => {
    if (saving) return;

    try {
      setSaving(true);

      const dataToSend = {
        ...formData,
        name: formData.name.trim(),
        bio: formData.bio.trim(),
        college: formData.college.trim(),
        course: formData.course.trim(),
        studyGoal: formData.studyGoal.trim(),
        dailyStudyTarget: Number(formData.dailyStudyTarget),
      };

      if (!dataToSend.year) {
        delete dataToSend.year;
      }

      const response = await api.put("/users/profile", dataToSend);

      const updatedUser = response.data.user;

      setUser(updatedUser);
      setAuthUser(updatedUser);

      setFormData({
        name: updatedUser.name || "",
        bio: updatedUser.bio || "",
        college: updatedUser.college || "",
        course: updatedUser.course || "",
        year: updatedUser.year || "",
        studyGoal: updatedUser.studyGoal || "",
        dailyStudyTarget: updatedUser.dailyStudyTarget || "",
        accountabilityPartners: updatedUser.accountabilityPartners || [],
      });

      toast.success(response.data.message);

      setShowModal(false);
    } catch (error) {
      if (error.response?.data?.errors?.length) {
        toast.error(error.response.data.errors[0].msg);
      } else {
        toast.error(
          error.response?.data?.message || "Failed to update profile.",
        );
      }
    } finally {
      setSaving(false);
    }
  };

  const connectPartner = async () => {
    if (connecting) return;

    const code = partnerCode.trim().toUpperCase();

    if (!code) {
      return toast.error("Enter a partner code.");
    }

    try {
      setConnecting(true);

      const response = await api.post("/users/connect-partner", {
        partnerCode: code,
      });

      setUser(response.data.user);
      setAuthUser(response.data.user);

      setPartnerCode("");

      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Connection failed.");
    } finally {
      setConnecting(false);
    }
  };

  const disconnectPartner = async (partnerId) => {
    try {
      const response = await api.delete(
        `/users/disconnect-partner/${partnerId}`,
      );

      setUser(response.data.user);
      setAuthUser(response.data.user);

      toast.success(response.data.message);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to disconnect partner.",
      );
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-card">
        <img
          src={user.profilePicture}
          alt={`${user.name}'s profile`}
          className="profile-image"
          onError={(e) => {
            e.target.src =
              "https://ik.imagekit.io/2gnckpnjs/ffa31224f6efb03a7156cfea05b9e5ab.jpg";
          }}
        />

        <h1>{formatName(user.name)}</h1>

        <p className="profile-email">{user.email}</p>

        <div className="partner-code-card">
          <span>Your Partner Code</span>

          <div className="partner-code-box">
            <h2>
              {showPartnerCode
                ? user.partnerCode || "Not Generated"
                : user.partnerCode
                  ? user.partnerCode.replace(/.(?=.{4})/g, "*")
                  : "Not Generated"}
            </h2>

            <div className="partner-code-actions">
              <button
                type="button"
                onClick={() => setShowPartnerCode((prev) => !prev)}
              >
                {showPartnerCode ? "Hide" : "Show"}
              </button>

              <button
                type="button"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(user.partnerCode);
                    toast.success("Partner code copied.");
                  } catch {
                    toast.error("Unable to copy partner code.");
                  }
                }}
              >
                Copy
              </button>
            </div>
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
                maxLength={9}
                disabled={connecting}
                onChange={(e) => setPartnerCode(e.target.value.toUpperCase())}
              />

              <button
                type="button"
                onClick={connectPartner}
                disabled={connecting}
              >
                {connecting ? "Connecting..." : "Connect"}
              </button>
            </div>

            <div className="connected-partner">
              <span>Connected Partners</span>

              {!user.accountabilityPartners?.length ? (
                <h2>Not Connected</h2>
              ) : (
                user.accountabilityPartners.map((partner) => (
                  <div key={partner._id} className="partner-item">
                    <div>
                      <h3>{formatName(partner.name)}</h3>
                      <p>{partner.email}</p>
                    </div>

                    <div className="partner-actions">
                      <button
                        className="chat-btn"
                        onClick={() => navigate(`/chat?partner=${partner._id}`)}
                      >
                        Chat
                      </button>

                      <button
                        className="disconnect-btn"
                        onClick={() => disconnectPartner(partner._id)}
                      >
                        Disconnect
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <button
          type="button"
          className="edit-btn"
          onClick={() => setShowModal(true)}
        >
          Edit Profile
        </button>
        <button
          className="delete-btn"
          onClick={async () => {
            const ok = window.confirm(
              "Are you sure you want to permanently delete your account?",
            );

            if (!ok) return;

            try {
              const res = await api.delete("/users/profile");

              toast.success(res.data.message);

              setAuthUser(null);
            } catch (error) {
              toast.error(
                error.response?.data?.message || "Failed to delete account.",
              );
            }
          }}
        >
          Delete Account
        </button>
      </div>

      {showModal && (
        <div
          className="modal-overlay"
          onClick={() => {
            if (!saving) {
              setShowModal(false);
            }
          }}
        >
          <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Profile</h2>

            <input
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              maxLength={50}
              disabled={saving}
            />

            <input
              name="college"
              placeholder="College"
              value={formData.college}
              onChange={handleChange}
              maxLength={100}
              disabled={saving}
            />

            <input
              name="course"
              placeholder="Course"
              value={formData.course}
              onChange={handleChange}
              maxLength={100}
              disabled={saving}
            />

            <input
              type="number"
              name="year"
              placeholder="Year"
              min="1"
              max="6"
              value={formData.year}
              onChange={handleChange}
              disabled={saving}
            />

            <input
              type="number"
              name="dailyStudyTarget"
              placeholder="Daily Target (hours)"
              min="1"
              max="24"
              value={formData.dailyStudyTarget}
              onChange={handleChange}
              disabled={saving}
            />

            <input
              name="studyGoal"
              placeholder="Study Goal"
              value={formData.studyGoal}
              onChange={handleChange}
              maxLength={100}
              disabled={saving}
            />

            <textarea
              rows="4"
              name="bio"
              placeholder="Bio"
              value={formData.bio}
              onChange={handleChange}
              maxLength={300}
              disabled={saving}
            />

            <input
              name="profilePicture"
              placeholder="Profile Image URL"
              value={formData.profilePicture || ""}
              onChange={handleChange}
            />

            <div className="modal-buttons">
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setShowModal(false)}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="button"
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