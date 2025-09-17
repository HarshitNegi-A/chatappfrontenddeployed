import React, { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import axios from "axios";

export default function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatRef = useRef(null);
  const socketRef = useRef(null);

  // Load old messages (REST)
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:3000/chat", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(res.data);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };
    fetchMessages();
  }, []);

  // Connect to WebSocket
  useEffect(() => {
    const token = localStorage.getItem("token");
    const socket = io("http://localhost:3000", { auth: { token } });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Connected:", socket.id);
    });

    socket.on("receive-message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.disconnect();
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  // Send message
  const handleSend = () => {
    if (!input.trim()) return;
    socketRef.current.emit("send-message", { text: input });
    setInput("");
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto border rounded-xl shadow-lg overflow-hidden">
      <div className="bg-blue-600 text-white p-4 font-semibold">Simple Chat</div>
      <div ref={chatRef} className="flex-1 overflow-y-auto p-4 bg-gray-100">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-3 flex ${msg.UserId === parseInt(localStorage.getItem("userId"))
                ? "justify-end"
                : "justify-start"
              }`}
          >
            <div
              className={`max-w-[70%] px-4 py-2 rounded-2xl shadow-md ${msg.UserId === parseInt(localStorage.getItem("userId"))
                  ? "bg-green-500 text-white rounded-br-none"
                  : "bg-white text-gray-900 rounded-bl-none"
                }`}
            >
              <div>{msg.message}</div>
              <div className="text-xs text-right opacity-70">
                {new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center p-3 border-t bg-white">
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 border rounded-full px-4 py-2 mr-2"
        />
        <button
          onClick={handleSend}
          className="bg-green-500 text-white px-4 py-2 rounded-full"
        >
          Send
        </button>
      </div>
    </div>
  );
}
