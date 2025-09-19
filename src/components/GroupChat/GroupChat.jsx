import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function GroupChat() {
  const { groupId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const ref = useRef(null);

  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);
  const currentUserId = decoded.id;

  useEffect(() => {
    // Fetch history
    const fetchHistory = async () => {
      const res = await axios.get(`http://localhost:3000/groups/${groupId}/messages`);
      setMessages(res.data);
    };
    fetchHistory();

    // Socket connect
    const socket = io("http://localhost:3000", { auth: { token } });

    socket.on("connect", () => {
      socket.emit("group:join", { groupId });
    });

    socket.on("group:message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, [groupId, token]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const socket = io("http://localhost:3000", { auth: { token } });
    socket.emit("group:new_message", { groupId, text: input });
    setInput("");
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Group Chat {groupId}</h2>
     <div>
  {messages.map((msg) => (
    <div key={msg.id}>
      <strong>{msg.user?.name || "Unknown"}</strong>: {msg.message}
    </div>
  ))}
</div>

      <div className="flex mt-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border p-2"
        />
        <button onClick={sendMessage} className="bg-green-500 text-white px-4">
          Send
        </button>
      </div>
    </div>
  );
}
