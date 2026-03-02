import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await axios.post("https://event-booking-backend-wx17.onrender.com/api/users/register/", {
        email,
        password,
      });

      alert("Registration successful! Please login.");
      navigate("/");

    } catch (error) {
      alert("Registration failed.");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">

      <div className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl rounded-2xl p-10 w-full max-w-md text-white">

        <h1 className="text-4xl font-extrabold text-center mb-8">
          🎟 Event Booking
        </h1>

        <form onSubmit={handleRegister} className="space-y-6">

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
              placeholder="Create password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-yellow-500 text-black font-semibold hover:bg-yellow-400 transition duration-300 shadow-lg"
          >
            Register
          </button>

        </form>

        <p className="mt-6 text-center text-gray-300 text-sm">
          Already have an account?{" "}
          <Link to="/" className="text-yellow-400 hover:underline">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Register;