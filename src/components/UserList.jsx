import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");
  let currentUserId = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      currentUserId = decoded.id; // ✅ current logged-in user ID
    } catch (err) {
      console.error("JWT decode error:", err);
    }
  }

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:3000/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // ✅ filter out current user
        const filtered = res.data.filter((u) => u.id !== currentUserId);
        setUsers(filtered);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    if (token) fetchUsers();
  }, [token, currentUserId]);

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id} className="mb-2">
            <Link
              to={`/chat/${user.id}`}
              className="text-blue-600 underline"
            >
              Chat with {user.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
