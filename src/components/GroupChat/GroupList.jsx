import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function GroupList() {
  // ✅ Define API base URL once
  const BASE_URL = "http://localhost:3000";

  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [joinedGroups, setJoinedGroups] = useState([]); // [{id, role}]

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

  // ✅ Fetch all groups + user memberships
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const [allRes, myRes] = await Promise.all([
          axios.get(`${BASE_URL}/groups`),
          axios.get(`${BASE_URL}/groups/my/${currentUserId}`),
        ]);

        setGroups(allRes.data);
        setJoinedGroups(myRes.data);
      } catch (err) {
        console.error("Error fetching groups:", err);
      }
    };

    if (currentUserId) fetchGroups();
  }, [currentUserId]);

  // ✅ Create new group
  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!groupName.trim()) return;

    try {
      const res = await axios.post(`${BASE_URL}/groups`, {
        name: groupName,
        userId: currentUserId,
      });

      setGroups((prev) => [...prev, res.data.group]);
      setJoinedGroups((prev) => [
        ...prev,
        { id: res.data.group.id, role: "admin" },
      ]);

      setGroupName("");
    } catch (err) {
      console.error("Error creating group:", err);
    }
  };

  // ✅ Join group
  const handleJoinGroup = async (groupId) => {
    try {
      await axios.post(`${BASE_URL}/groups/${groupId}/join`, {
        userId: currentUserId,
      });
      setJoinedGroups((prev) => [...prev, { id: groupId, role: "member" }]);
    } catch (err) {
      console.error("Error joining group:", err);
    }
  };

  // ✅ Helper: check membership
  const getMembership = (groupId) =>
    joinedGroups.find((g) => g.id === groupId);

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow-lg rounded-2xl border border-gray-200">
      <h2 className="text-2xl font-semibold mb-6 text-center text-green-600">
        Groups
      </h2>

      {/* ✅ Create Group Form */}
      <form
        onSubmit={handleCreateGroup}
        className="flex items-center gap-2 mb-6"
      >
        <input
          type="text"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Enter group name"
          className="flex-1 border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-400 outline-none"
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
        >
          Create
        </button>
      </form>

      {/* ✅ Group List */}
      <ul className="divide-y divide-gray-100">
        {groups.length === 0 ? (
          <p className="text-center text-gray-500 mt-6">
            No groups available yet
          </p>
        ) : (
          groups.map((g) => {
            const membership = getMembership(g.id);
            return (
              <li
                key={g.id}
                className="py-3 flex justify-between items-center hover:bg-gray-50 px-2 rounded-lg transition"
              >
                <Link
                  to={`/groups/${g.id}`}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  {g.name}
                </Link>

                {membership ? (
                  <span
                    className={`text-sm font-semibold ${
                      membership.role === "admin"
                        ? "text-yellow-600"
                        : "text-green-600"
                    }`}
                  >
                    {membership.role === "admin" ? "👑 Admin" : "Member"}
                  </span>
                ) : (
                  <button
                    onClick={() => handleJoinGroup(g.id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition text-sm"
                  >
                    Join
                  </button>
                )}
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
