import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("access");

        const response = await axios.get(
          "https://event-booking-backend-wx17.onrender.com/api/bookings/my-bookings/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setBookings(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchBookings();
  }, []);


return (
  <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-10">

    {/* Page Title */}
    <div className="text-center mb-12">
      <h1 className="text-4xl font-extrabold text-gray-900">
        🎟 My Bookings
      </h1>
      <p className="text-gray-600 mt-2">
        All your confirmed reservations in one place
      </p>
    </div>

    {/* If No Bookings */}
    {bookings.length === 0 && (
      <div className="text-center mt-20">
        <div className="text-6xl mb-4">😔</div>
        <h2 className="text-xl font-semibold text-gray-700">
          No bookings yet
        </h2>
        <p className="text-gray-500 mt-2">
          Start booking your favorite events now!
        </p>
      </div>
    )}

    {/* Booking Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

      {bookings.map((booking) => (
        <div
          key={booking.id}
          onClick={() => navigate(`/my-bookings/${booking.id}`)}
          className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 p-6"
        >

          {/* Event Title */}
          <h3 className="text-2xl font-semibold text-gray-900 mb-3">
            {booking.event?.title}
          </h3>

          {/* Location */}
          <p className="text-gray-500 text-sm mb-2">
            📍 {booking.event?.location}
          </p>

          {/* Event Date */}
          <p className="text-gray-500 text-sm mb-4">
            📅 {new Date(booking.event?.date_time).toLocaleString()}
          </p>

          {/* Seats */}
          <div className="mt-4">
            <p className="text-gray-700 font-semibold mb-2">
              🎫 Seats Booked ({booking.seats.length})
            </p>

            <div className="flex flex-wrap gap-2">
              {booking.seats.map((seat) => (
                <span
                  key={seat.id}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold"
                >
                  {seat.seat_number}
                </span>
              ))}
            </div>
          </div>

          {/* Status */}
          <div className="flex justify-between items-center mt-6">

            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700">
              Confirmed
            </span>

            <span className="text-sm text-gray-400">
              Booking #{booking.id}
            </span>

          </div>

        </div>
      ))}

    </div>

  </div>
);
}

export default MyBookings;