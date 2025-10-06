import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export default function PersonalChat() {
  // ✅ Define base URL once
  const BASE_URL = "https://chatappbackenddeployed-production.up.railway.app";

  const { targetUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatRef = useRef(null);
  const socketRef = useRef(null);

  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);
  const currentUserId = decoded.id;

  const roomId = [currentUserId, targetUserId].sort().join("_");

  // ✅ Fetch chat history on mount
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/chat/history/${roomId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(res.data);
      } catch (err) {
        console.error("Error fetching history:", err);
      }
    };

    fetchHistory();
  }, [roomId, token]);

  // ✅ Setup socket connection
  useEffect(() => {
    const socket = io(BASE_URL, { auth: { token } });
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("join_room", roomId);
    });

    socket.on("receive_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId, token]);

  // ✅ Auto-scroll to bottom when messages update
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  // ✅ Send message
  const handleSend = () => {
    if (!input.trim()) return;
    socketRef.current.emit("new_message", { roomId, text: input });
    setInput("");
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-green-500 text-white p-4 font-semibold shadow-sm">
        Chat with <span className="italic">User {targetUserId}</span>
      </div>

      {/* Messages Section */}
      <div
        ref={chatRef}
        className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-3"
      >
        {messages.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">No messages yet</p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id || msg.createdAt}
              className={`flex ${
                msg.UserId === currentUserId
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-[75%] px-4 py-2 rounded-2xl shadow-md transition ${
                  msg.UserId === currentUserId
                    ? "bg-green-500 text-white rounded-br-none"
                    : "bg-white text-gray-900 rounded-bl-none border border-gray-100"
                }`}
              >
                <div>{msg.message}</div>
                <div className="text-xs text-right opacity-70 mt-1">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input Bar */}
      <div className="flex items-center p-3 border-t bg-white">
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 mr-2 focus:ring-2 focus:ring-green-400 outline-none"
        />
        <button
          onClick={handleSend}
          className="bg-green-500 text-white px-5 py-2 rounded-full hover:bg-green-600 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}
