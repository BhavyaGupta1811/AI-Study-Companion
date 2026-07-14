import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { FaPaperPlane, FaTrash } from "react-icons/fa";
import { IoIosWarning } from "react-icons/io";
import { useSearchParams } from "react-router-dom";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "../styles/Chat.css";

function Chat() {
  const { user } = useAuth();

  const [messages, setMessages] = useState([]);
  const [partners, setPartners] = useState([]);
  const [partner, setPartner] = useState(null);

  const [text, setText] = useState("");

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const [searchParams] = useSearchParams();

  const partnerId = searchParams.get("partner");

  const bottomRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    loadPartners();
  }, [user]);

  useEffect(() => {
    if (!partner) return;

    getMessages();

    const interval = setInterval(() => {
      getMessages(true);
    }, 3000);

    return () => clearInterval(interval);
  }, [partner]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  useEffect(() => {
    if (!partnerId || partners.length === 0) return;

    const selected = partners.find((p) => p._id === partnerId);

    if (selected) {
      setPartner(selected);
    }
  }, [partnerId, partners]);

  const loadPartners = async () => {
    try {
      const response = await api.get("/users/profile");

      const list = response.data.user.accountabilityPartners || [];

      setPartners(list);

      if (!partner && list.length > 0) {
        setPartner(list[0]);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load partners.");
    }
  };

  const getMessages = async (silent = false) => {
    try {
      if (!partner) return;

      if (!silent) {
        setLoading(true);
      }

      const response = await api.get("/messages", {
        params: {
          partnerId: partner._id,
        },
      });

      setMessages(response.data.messages || []);
    } catch (error) {
      // avoid repeated toast during polling
      if (!silent) {
        toast.error(
          error.response?.data?.message || "Failed to load messages.",
        );
      }
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  };

  const sendMessage = async () => {
    const message = text.trim();

    if (!message || sending || !partner) return;

    try {
      setSending(true);

      const response = await api.post("/messages", {
        text: message,
        partnerId: partner._id,
      });

      setMessages((prev) => [...prev, response.data.data]);

      setText("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  const deleteMessage = async (id) => {
    try {
      await api.delete(`/messages/${id}`);

      setMessages((prev) => prev.filter((message) => message._id !== id));

      toast.success("Message deleted.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete message.");
    }
  };

  return (
    <div className="chat-page">
      <div className="chat-layout">
        <div className="partners-sidebar">
          <h3>Partners</h3>

          {partners.length === 0 ? (
            <p>No partners added.</p>
          ) : (
            partners.map((p) => (
              <button
                key={p._id}
                className={
                  partner?._id === p._id ? "partner-active" : "partner-button"
                }
                onClick={() => setPartner(p)}
              >
                {p.name}
              </button>
            ))
          )}
        </div>

        <div className="chat-container">
          <div className="chat-header">
            {partner ? (
              <>
                <img
                  src={partner.profilePicture}
                  alt={partner.name}
                  className="partner-image"
                />

                <div>
                  <h2>{partner.name}</h2>

                  <p>Accountability Partner</p>
                </div>
              </>
            ) : (
              <div>
                <h2>Chat</h2>

                <p>No Accountability Partner</p>
              </div>
            )}
          </div>

          <div className="chat-messages">
            {loading ? (
              <div className="empty-chat">
                <h3>Loading...</h3>
              </div>
            ) : messages.length === 0 ? (
              <div className="empty-chat">
                <h3>No Messages Yet</h3>

                <p>Start your first conversation.</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message._id}
                  className={
                    message.systemMessage
                      ? "system-message"
                      : message.sender?._id === user._id
                        ? "my-message"
                        : "partner-message"
                  }
                >
                  <div className="message-wrapper">
                    <div className="message-bubble">
                      {message.systemMessage && (
                        <div className="system-tag">
                          <IoIosWarning />
                          Study Reminder Alert
                        </div>
                      )}

                      {message.text}
                    </div>

                    {!message.systemMessage &&
                      message.sender?._id === user._id && (
                        <button
                          className="delete-message"
                          onClick={() => deleteMessage(message._id)}
                        >
                          <FaTrash />
                        </button>
                      )}
                  </div>

                  <span>
                    {new Date(message.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              ))
            )}

            <div ref={bottomRef} />
          </div>

          <div className="chat-input-area">
            <input
              type="text"
              placeholder={partner ? "Type a message..." : "Add partner first"}
              value={text}
              disabled={!partner}
              maxLength={500}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
            />

            <button onClick={sendMessage} disabled={sending || !partner}>
              {sending ? "..." : <FaPaperPlane />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
