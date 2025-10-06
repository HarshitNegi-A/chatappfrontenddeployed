import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function UserList() {
  // ✅ Define API base URL
  const BASE_URL = "https://chatappbackenddeployed-production.up.railway.app";

  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");
  let currentUserId = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      currentUserId = decoded.id;
    } catch (err) {
      console.error("JWT decode error:", err);
    }
  }

  // ✅ Fetch all users except current one
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Filter out current user
        const filtered = res.data.filter((u) => u.id !== currentUserId);
        setUsers(filtered);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    if (token) fetchUsers();
  }, [token, currentUserId]);

  return (
    <div className="p-6 max-w-lg mx-auto bg-white border border-gray-200 rounded-2xl shadow-lg">
      {/* ✅ Header */}
      <h2 className="text-2xl font-semibold mb-6 text-center text-green-600">
        Available Users
      </h2>

      {/* ✅ User List */}
      {users.length === 0 ? (
        <p className="text-gray-500 text-center mt-6">
          No other users found.
        </p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {users.map((user) => (
            <li
              key={user.id}
              className="py-3 flex justify-between items-center hover:bg-gray-50 px-2 rounded-lg transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 text-green-700 flex items-center justify-center rounded-full font-semibold uppercase">
                  {user.name ? user.name[0] : "?"}
                </div>
                <span className="font-medium text-gray-800">
                  {user.name}
                </span>
              </div>

              <Link
                to={`/chat/${user.id}`}
                className="text-white bg-green-500 hover:bg-green-600 transition px-3 py-1.5 rounded-lg text-sm font-medium"
              >
                Chat
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
