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
    <nav className="bg-green-600 text-white px-6 py-3 shadow-lg sticky top-0 z-50">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        {/* ✅ Brand */}
        <div
          onClick={() => navigate("/")}
          className="font-bold text-xl cursor-pointer hover:text-green-200 transition"
        >
          Chat App 💬
        </div>

        {/* ✅ Links */}
        <div className="flex items-center gap-6 text-sm font-medium">
          {/* Always show Home */}
          <Link
            to="/"
            className="hover:text-green-200 transition"
          >
            Home
          </Link>

          {/* Show these only when logged in */}
          {isLoggedIn && (
            <>
              <Link
                to="/chat"
                className="hover:text-green-200 transition"
              >
                Global Chat
              </Link>
              <Link
                to="/users"
                className="hover:text-green-200 transition"
              >
                Personal Chat
              </Link>
              <Link
                to="/groups"
                className="hover:text-green-200 transition"
              >
                Groups
              </Link>
              <span className="italic text-sm text-green-100">
                Hi, {userName}
              </span>
            </>
          )}

          {/* Show Signup if not logged in */}
          {!isLoggedIn && (
            <Link
              to="/signup"
              className="hover:text-green-200 transition"
            >
              Signup
            </Link>
          )}

          {/* Logout Button */}
          {isLoggedIn && (
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
