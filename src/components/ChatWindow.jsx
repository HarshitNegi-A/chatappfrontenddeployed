import React, { useState, useRef, useEffect } from "react";

export default function ChatUI() {
  const [messages, setMessages] = useState([
    { id: 1, from: "other", text: "Hey! How are you?", time: "10:00 AM" },
    { id: 2, from: "me", text: "I’m good, thanks! What about you?", time: "10:02 AM" },
  ]);

  const [input, setInput] = useState("");
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const now = new Date();
    const newMsg = {
      id: Date.now(),
      from: "me",
      text: input,
      time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages([...messages, newMsg]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto border rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white p-4 font-semibold">
        Simple Chat
      </div>

      {/* Messages */}
      <div ref={chatRef} className="flex-1 overflow-y-auto p-4 bg-gray-100">
        {messages.map((msg) => (
          <div key={msg.id} className={`mb-3 flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[70%] px-4 py-2 rounded-2xl shadow-md ${
                msg.from === "me"
                  ? "bg-green-500 text-white rounded-br-none"
                  : "bg-white text-gray-900 rounded-bl-none"
              }`}
            >
              <div>{msg.text}</div>
              <div className="text-xs text-right opacity-70">{msg.time}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex items-center p-3 border-t bg-white">
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
          className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600"
        >
          Send
        </button>
      </div>
    </div>
  );
}