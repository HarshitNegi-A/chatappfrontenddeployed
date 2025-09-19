import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ChatWindow from "./components/ChatWindow";
import SignUp from "./components/Signup";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import PersonalChat from "./components/PersonalChat";
import UserList from "./components/UserList"; // ✅ add user list page

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<Home />} />

        {/* Group Chat */}
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatWindow />
            </ProtectedRoute>
          }
        />

        {/* Personal Chat */}
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <UserList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat/:targetUserId"
          element={
            <ProtectedRoute>
              <PersonalChat />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
