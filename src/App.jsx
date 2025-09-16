import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ChatWindow from "./components/ChatWindow";
import SignUp from "./components/Signup";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Navbar/>

      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<ProtectedRoute><ChatWindow /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App
