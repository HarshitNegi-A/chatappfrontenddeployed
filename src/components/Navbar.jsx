import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  let userName = "";
  if (token) {
    try {
      const decoded = jwtDecode(token);
      userName = decoded.name || "";
    } catch (err) {
      console.error("JWT decode error:", err);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/");
  };

  return (
    <nav className="flex items-center justify-between bg-blue-600 px-6 py-3 text-white shadow-md">
      <div className="font-bold text-lg">Chat App</div>

      <div className="flex items-center gap-6">
        {/* Always show Home */}
        <Link to="/" className="hover:text-gray-200">
          Home
        </Link>

        {/* Only show these if logged in */}
        {isLoggedIn && (
          <>
            <Link to="/chat" className="hover:text-gray-200">
              Global Chat
            </Link>
            <Link to="/users" className="hover:text-gray-200">
              Personal Chat
            </Link>
            <Link to="/groups" className="hover:text-gray-200">
              Groups
            </Link>
            <span className="italic">Hi, {userName}</span>
          </>
        )}

        {/* Show Signup if not logged in */}
        {!isLoggedIn && (
          <Link to="/signup" className="hover:text-gray-200">
            Signup
          </Link>
        )}

        {/* Logout button */}
        {isLoggedIn && (
          <button
            onClick={handleLogout}
            className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
