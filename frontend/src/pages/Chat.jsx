import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaPaperPlane, FaTrash } from "react-icons/fa";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "../styles/Chat.css";
import { useRef } from "react";
function Chat() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);
  const [partner, setPartner] = useState(null);
  useEffect(() => {
    getMessages();
  }, []);

  async function getMessages() {
    try {
      const response = await api.get("/messages");
      const chats = response.data.messages;

      setMessages(chats);

      if (chats.length > 0) {
        const first = chats[0];

        setPartner(
          first.sender._id === user._id ? first.receiver : first.sender,
        );
      } else {
        const profile = await api.get("/users/profile");

        setPartner(profile.data.user.accountabilityPartner);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load messages");
    } finally {
      setLoading(false);
    }
  }

  async function sendMessage() {
    if (!text.trim()) return;

    try {
      setSending(true);

      const response = await api.post("/messages", {
        text,
      });

      setMessages((prev) => [...prev, response.data.data]);

      setText("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  }

  async function deleteMessage(id) {
    try {
      await api.delete(`/messages/${id}`);

      setMessages((prev) => prev.filter((message) => message._id !== id));

      toast.success("Message deleted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete message");
    }
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div className="chat-page">
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
            <>
              <h2>Chat</h2>
              <p>No Accountability Partner</p>
            </>
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
            <>
              {messages.map((message) => (
                <div
                  key={message._id}
                  className={
                    message.sender._id === user._id
                      ? "my-message"
                      : "partner-message"
                  }
                >
                  <div className="message-wrapper">
                    <div className="message-bubble">{message.text}</div>

                    {message.sender._id === user._id && (
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
              ))}

              <div ref={bottomRef}></div>
            </>
          )}
        </div>

        <div className="chat-input-area">
          <input
            type="text"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
          />

          <button onClick={sendMessage} disabled={sending}>
            sending ? "..." : <FaPaperPlane />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
