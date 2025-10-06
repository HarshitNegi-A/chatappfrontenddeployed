import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  // ✅ Base URL
  const BASE_URL = "http://localhost:3000";

  const [login, setLogin] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phno: "",
    pass: "",
  });
  const navigate = useNavigate();

  // ✅ Handle input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // ✅ Toggle between Login and Signup
  const handleLogin = () => {
    setLogin(!login);
  };

  // ✅ Handle form submit
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = login ? "login" : "signup";
      const res = await axios.post(`${BASE_URL}/${endpoint}`, formData, {
        headers: { "Content-Type": "application/json" },
      });

      localStorage.setItem("token", res.data.token);
      alert(res.data.message);
      navigate("/chat");
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message || "Something went wrong");
      } else {
        alert("Network error, please try again");
      }
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-400 to-green-600">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        {/* Header */}
        <h1 className="text-2xl font-bold text-center mb-6 text-green-600">
          {login ? "Login" : "Sign Up"}
        </h1>

        {/* ✅ Form */}
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {!login && (
            <>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full mt-1 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full mt-1 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
                />
              </div>
            </>
          )}

          <div>
            <label
              htmlFor="phno"
              className="block text-sm font-medium text-gray-700"
            >
              Phone Number
            </label>
            <input
              id="phno"
              type="number"
              value={formData.phno}
              onChange={handleChange}
              required
              className="w-full mt-1 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="pass"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="pass"
              type="password"
              value={formData.pass}
              onChange={handleChange}
              required
              className="w-full mt-1 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 text-white font-semibold py-2 rounded-lg hover:bg-green-600 transition"
          >
            Submit
          </button>
        </form>

        {/* ✅ Toggle Login/Signup */}
        <div className="text-center mt-4">
          <button
            onClick={handleLogin}
            className="text-green-600 hover:text-green-700 font-medium"
          >
            {login ? "New here? Sign Up" : "Already have an account? Log In"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
