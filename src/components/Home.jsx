const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-400 to-green-600 text-white px-6">
      {/* ✅ Main container */}
      <div className="bg-white text-gray-800 p-8 rounded-2xl shadow-2xl max-w-2xl w-full text-center">
        {/* ✅ Header */}
        <h1 className="text-4xl font-bold mb-4 text-green-600">
          Welcome to Chat App 💬
        </h1>
        <p className="text-lg mb-6 text-gray-700">
          Connect, communicate, and collaborate with ease!  
          Chat App lets you send instant messages, share media, and create groups — all in real time.
        </p>

        {/* ✅ Feature section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left mb-6">
          <div className="p-4 bg-green-50 rounded-lg shadow-sm hover:shadow-md transition">
            <h3 className="text-green-600 font-semibold mb-2">🌍 Global Chat</h3>
            <p className="text-sm text-gray-600">
              Join the global chatroom and talk with everyone instantly.
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg shadow-sm hover:shadow-md transition">
            <h3 className="text-green-600 font-semibold mb-2">👥 Personal Chats</h3>
            <p className="text-sm text-gray-600">
              Have one-on-one private conversations with other users.
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg shadow-sm hover:shadow-md transition">
            <h3 className="text-green-600 font-semibold mb-2">💬 Group Chats</h3>
            <p className="text-sm text-gray-600">
              Create or join groups and chat with multiple people at once.
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg shadow-sm hover:shadow-md transition">
            <h3 className="text-green-600 font-semibold mb-2">🔒 Secure Messaging</h3>
            <p className="text-sm text-gray-600">
              Your messages are secure with token-based authentication.
            </p>
          </div>
        </div>

        {/* ✅ Call to action */}
        <div>
          <a
            href="/signup"
            className="bg-green-500 text-white font-semibold px-6 py-2 rounded-lg hover:bg-green-600 transition"
          >
            Get Started
          </a>
        </div>
      </div>

      {/* ✅ Footer */}
      <p className="mt-8 text-sm text-white/80">
        © {new Date().getFullYear()} Chat App — Built for seamless communication 💚
      </p>
    </div>
  );
};

export default Home;
