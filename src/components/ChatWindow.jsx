import React, { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function ChatWindow() {
  const BASE_URL = "https://chatappbackenddeployed-production.up.railway.app";

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatRef = useRef(null);
  const socketRef = useRef(null);

  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);
  const currentUserId = decoded.id;

  // ✅ Load old messages (with sender info)
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/chat`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(res.data);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };
    fetchMessages();
  }, [token]);

  // ✅ Connect to WebSocket
  useEffect(() => {
    const socket = io(BASE_URL, { auth: { token } });
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("🟢 Connected:", socket.id);
    });

    socket.on("receive_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.disconnect();
  }, [token]);

  // ✅ Auto-scroll to latest message
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  // ✅ Send message
  const handleSend = () => {
    if (!input.trim()) return;

    const payload = {
      text: input,
      user: { id: currentUserId, name: decoded.name }, // send sender info
    };

    socketRef.current.emit("send-message", payload);
    setInput("");
  };

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto border rounded-2xl shadow-xl overflow-hidden mt-4 bg-white">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 font-semibold text-lg">
        🌍 Global Chat
      </div>

      {/* Messages */}
      <div ref={chatRef} className="flex-1 overflow-y-auto p-6 bg-gray-50">
        {messages.length === 0 ? (
          <p className="text-gray-500 text-center mt-10">
            No messages yet. Start chatting!
          </p>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-4 flex ${
                msg.user?.id === currentUserId
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-[75%] px-4 py-3 rounded-2xl shadow-md ${
                  msg.user?.id === currentUserId
                    ? "bg-green-500 text-white rounded-br-none"
                    : "bg-white border border-gray-200 text-gray-900 rounded-bl-none"
                }`}
              >
                {/* ✅ Sender name */}
                <div
                  className={`text-sm font-semibold mb-1 ${
                    msg.user?.id === currentUserId
                      ? "text-green-100"
                      : "text-blue-600"
                  }`}
                >
                  {msg.user?.name || "Unknown User"}
                </div>

                {/* ✅ Message text */}
                <div className="text-base">{msg.message || msg.text}</div>

                {/* ✅ Timestamp */}
                {msg.createdAt && (
                  <div className="text-xs text-right opacity-70 mt-1">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input */}
      <div className="flex items-center p-4 border-t bg-white">
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 border rounded-full px-4 py-2 mr-2 focus:outline-none focus:ring-2 focus:ring-green-400"
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
