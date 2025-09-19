import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function GroupChat() {
  const { groupId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const ref = useRef(null);
  const socketRef = useRef(null);

  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);
  const currentUserId = decoded.id;

  useEffect(() => {
    // ✅ Fetch history
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/groups/${groupId}/messages`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(res.data);
      } catch (err) {
        console.error("Error fetching history:", err);
      }
    };
    fetchHistory();

    // ✅ Setup socket
    const socket = io("http://localhost:3000", { auth: { token } });
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Connected to socket:", socket.id);
      socket.emit("group:join", { groupId });
    });

    socket.on("group:message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, [groupId, token]);

  // ✅ Send text message
  const sendMessage = () => {
    if (!input.trim()) return;
    socketRef.current.emit("group:new_message", { groupId, text: input });
    setInput("");
  };

  // ✅ Upload media file
  const uploadFile = async () => {
    if (!file) return;
    const form = new FormData();
    form.append("file", file);
    form.append("groupId", groupId);
    form.append("chatType", "group");

    try {
      await axios.post("http://localhost:3000/media/upload", form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setFile(null);
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Group Chat {groupId}</h2>

      {/* ✅ Messages */}
      <div ref={ref} className="border p-4 h-80 overflow-y-auto mb-4 bg-gray-50 rounded">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-3 p-2 rounded ${
              msg.user?.id === currentUserId ? "bg-green-100 text-right" : "bg-white text-left"
            }`}
          >
            <div className="text-sm font-semibold mb-1">
              {msg.user?.name || "Unknown"}
            </div>

            {msg.mediaUrl ? (
              msg.mimeType?.startsWith("image/") ? (
                <a href={msg.mediaUrl} target="_blank" rel="noreferrer">
                  <img
                    src={msg.mediaUrl}
                    alt="uploaded"
                    className="max-w-xs max-h-60 rounded cursor-pointer hover:opacity-80"
                  />
                </a>
              ) : msg.mimeType?.startsWith("video/") ? (
                <video
                  src={msg.mediaUrl}
                  controls
                  className="max-w-xs rounded"
                />
              ) : (
                <a
                  href={msg.mediaUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-500 underline"
                >
                  View / Download File
                </a>
              )
            ) : (
              <div>{msg.message}</div>
            )}
          </div>
        ))}
      </div>

      {/* ✅ Text input */}
      <div className="flex gap-2 mb-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border p-2 rounded"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="bg-green-500 text-white px-4 rounded hover:bg-green-600"
        >
          Send
        </button>
      </div>

      {/* ✅ File input */}
      <div className="flex gap-2">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="flex-1"
        />
        <button
          onClick={uploadFile}
          className="bg-blue-500 text-white px-4 rounded hover:bg-blue-600"
          disabled={!file}
        >
          Upload
        </button>
      </div>
    </div>
  );
}
