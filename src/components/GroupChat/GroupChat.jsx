import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function GroupChat() {
  const BASE_URL = "https://chatappbackenddeployed-production.up.railway.app";

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
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/groups/${groupId}/messages`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(res.data);
      } catch (err) {
        console.error("Error fetching history:", err);
      }
    };
    fetchHistory();

    const socket = io(BASE_URL, { auth: { token } });
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

  const sendMessage = () => {
    if (!input.trim()) return;
    socketRef.current.emit("group:new_message", { groupId, text: input });
    setInput("");
  };

  const uploadFile = async () => {
    if (!file) return;
    const form = new FormData();
    form.append("file", file);
    form.append("groupId", groupId);
    form.append("chatType", "group");

    try {
      const res = await axios.post(`${BASE_URL}/media/upload`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const mediaUrl = `${BASE_URL}${res.data.mediaUrl}`;

      socketRef.current.emit("group:new_message", {
        groupId,
        mediaUrl,
        mimeType: file.type,
      });

      setFile(null);
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed");
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto bg-white shadow-2xl rounded-2xl border border-gray-200 mt-6">
      <h2 className="text-3xl font-semibold mb-6 text-center text-green-600">
        Group Chat – {groupId}
      </h2>

      {/* ✅ Messages Box */}
      <div
        ref={ref}
        className="border p-6 h-[600px] overflow-y-auto mb-6 bg-gray-50 rounded-xl shadow-inner"
      >
        {messages.length === 0 ? (
          <p className="text-gray-500 text-center mt-16 text-lg">
            No messages yet
          </p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id || msg.createdAt}
              className={`mb-4 p-4 rounded-lg max-w-xl break-words ${
                msg.user?.id === currentUserId
                  ? "bg-green-100 ml-auto text-right"
                  : "bg-white mr-auto text-left border border-gray-100"
              }`}
            >
              <div className="text-sm font-semibold text-gray-700 mb-1">
                {msg.user?.name || "Unknown"}
              </div>

              {msg.mediaUrl ? (
                msg.mimeType?.startsWith("image/") ? (
                  <a href={msg.mediaUrl} target="_blank" rel="noreferrer">
                    <img
                      src={msg.mediaUrl}
                      alt="uploaded"
                      className="max-w-sm max-h-80 rounded-lg cursor-pointer hover:opacity-80 transition"
                    />
                  </a>
                ) : msg.mimeType?.startsWith("video/") ? (
                  <video
                    src={msg.mediaUrl}
                    controls
                    className="max-w-sm rounded-lg"
                  />
                ) : (
                  <a
                    href={msg.mediaUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    View / Download File
                  </a>
                )
              ) : (
                <div className="text-gray-800 text-base leading-relaxed">
                  {msg.message}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* ✅ Message Input */}
      <div className="flex items-center gap-3 mb-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-400 outline-none text-lg"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition text-lg font-medium"
        >
          Send
        </button>
      </div>

      {/* ✅ File Upload */}
      <div className="flex items-center gap-3">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="flex-1 text-base text-gray-600"
        />
        <button
          onClick={uploadFile}
          className={`px-6 py-3 rounded-lg text-white text-lg font-medium transition ${
            file
              ? "bg-blue-500 hover:bg-blue-600"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          disabled={!file}
        >
          Upload
        </button>
      </div>
    </div>
  );
}
