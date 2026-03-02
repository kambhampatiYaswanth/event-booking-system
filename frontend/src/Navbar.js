import { Link } from "react-router-dom";

function Navbar() {
  const token = localStorage.getItem("access");

  return (
    <nav className="bg-gray-900 text-white px-8 py-4 shadow-md flex justify-between items-center">
      
      <h1 className="text-xl font-bold tracking-wide">
        🎟 Event Booking
      </h1>

      {token && (
        <div className="space-x-6">
          <Link to="/events" className="hover:text-yellow-400 transition">
            Events
          </Link>
          <Link to="/my-bookings" className="hover:text-yellow-400 transition">
            My Bookings
          </Link>
          <button
            onClick={() => {
              localStorage.removeItem("access");
              window.location.href = "/";
            }}
            className="hover:text-red-400 transition"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;