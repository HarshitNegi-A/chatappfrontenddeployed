import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    // 🚫 not logged in → redirect to signup/login
    return <Navigate to="/signup" replace />;
  }

  // ✅ logged in → show the component
  return children;
}
