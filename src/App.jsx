import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ChatWindow from "./components/ChatWindow";
import SignUp from "./components/Signup";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import PersonalChat from "./components/PersonalChat";
import UserList from "./components/UserList";
import GroupChat from "./components/GroupChat/GroupChat";
import GroupList from "./components/GroupChat/GroupList";
   // ✅ new

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<Home />} />

        {/* 🌍 Global Group Chat */}
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatWindow />
            </ProtectedRoute>
          }
        />

        {/* 👤 Personal Chat */}
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

        {/* 👥 Groups (WhatsApp-style group chat) */}
        <Route
          path="/groups"
          element={
            <ProtectedRoute>
              <GroupList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/groups/:groupId"
          element={
            <ProtectedRoute>
              <GroupChat />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
