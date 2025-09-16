import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token"); // ✅ check login state

  const handleLogout = () => {
    localStorage.removeItem("token"); // remove JWT
    navigate("/"); // redirect to signup/login page
  };

  return (
    <nav className="flex items-center justify-between bg-blue-600 px-6 py-3 text-white shadow-md">
      <div className="font-bold text-lg">Group Chat App</div>
      <div className="flex gap-6">
         <Link to="/" className="hover:text-gray-200">
          Home
        </Link>
        <Link to="/chat" className="hover:text-gray-200">
          Chat
        </Link>
        {!isLoggedIn && <Link to="/signup" className="hover:text-gray-200">
          Signup
        </Link>}
       

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
