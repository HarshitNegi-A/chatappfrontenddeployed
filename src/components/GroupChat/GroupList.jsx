import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function GroupList() {
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
        const allRes = await axios.get("http://localhost:3000/groups");
        const myRes = await axios.get(`http://localhost:3000/groups/my/${currentUserId}`);

        setGroups(allRes.data);
        setJoinedGroups(myRes.data); // ✅ full objects {id, name, role}
      } catch (err) {
        console.error("Error fetching groups:", err);
      }
    };
    if (currentUserId) fetchGroups();
  }, [currentUserId]);

  // ✅ Create a new group
  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!groupName.trim()) return;

    try {
      const res = await axios.post("http://localhost:3000/groups", {
        name: groupName,
        userId: currentUserId,
      });

      // Add new group and mark as joined (as admin)
      setGroups((prev) => [...prev, res.data.group]);
      setJoinedGroups((prev) => [...prev, { id: res.data.group.id, role: "admin" }]);

      setGroupName("");
    } catch (err) {
      console.error("Error creating group:", err);
    }
  };

  // ✅ Join a group
  const handleJoinGroup = async (groupId) => {
    try {
      await axios.post(`http://localhost:3000/groups/${groupId}/join`, {
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
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Groups</h2>

      {/* ✅ Create Group Form */}
      <form onSubmit={handleCreateGroup} className="flex gap-2 mb-4">
        <input
          type="text"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Enter group name"
          className="flex-1 border px-3 py-2 rounded"
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-4 rounded hover:bg-green-600"
        >
          Create
        </button>
      </form>

      {/* ✅ Group List */}
      <ul>
        {groups.map((g) => {
          const membership = getMembership(g.id);
          return (
            <li key={g.id} className="mb-3 flex justify-between items-center">
              <Link to={`/groups/${g.id}`} className="text-blue-600 underline">
                {g.name}
              </Link>

              {membership ? (
                <span className="text-green-600 text-sm">
                  {membership.role === "admin" ? "👑 Admin" : "Member"}
                </span>
              ) : (
                <button
                  onClick={() => handleJoinGroup(g.id)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                >
                  Join
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
