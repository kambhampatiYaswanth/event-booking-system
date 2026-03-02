import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://event-booking-backend-wx17.onrender.com/api/token/",
        {
          email: email,
          password: password,
        }
      );

      localStorage.setItem("access", response.data.access);
      navigate("/events");

    } catch (error) {
      alert("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">

      <div className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl rounded-2xl p-10 w-full max-w-md text-white">

        {/* Project Title */}
        <h1 className="text-4xl font-extrabold text-center mb-8 tracking-wide">
          🎟 Event Booking
        </h1>

        <form onSubmit={handleLogin} className="space-y-6">

          <div>
            <label className="block text-sm mb-2 text-gray-300">
              Email
            </label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm mb-2 text-gray-300">
              Password
            </label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-yellow-500 text-black font-semibold hover:bg-yellow-400 transition duration-300 shadow-lg"
          >
            Login
          </button>
          <p className="mt-6 text-center text-gray-300 text-sm">
          Don’t have an account?{" "}
          <Link to="/register" className="text-yellow-400 hover:underline">
            Create Account
          </Link>
        </p>
        <p className="text-center text-sm text-gray-400 mb-6">
          Admin?{" "}
          <a
            href="https://event-booking-backend-wx17.onrender.com/admin/"
            className="text-yellow-400 hover:underline"
          >
            Login Here
          </a>
        </p>        
        </form>

      </div>

    </div>
  );
}

export default Login;