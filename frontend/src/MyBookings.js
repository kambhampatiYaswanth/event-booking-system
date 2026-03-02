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
  const groupedBookings = bookings.reduce((acc, booking) => {
    const eventId = booking.event?.id || booking.event;

    if (!acc[eventId]) {
      acc[eventId] = {
        event: booking.event,
        seats: [],
      };
    }

    acc[eventId].seats.push(
      booking.seat?.seat_number || booking.seat
    );

    return acc;
  }, {});  

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
      {Object.keys(groupedBookings).length === 0 && (
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
        {Object.values(groupedBookings).map((group, index) => (
          <div
            key={index}
            onClick={() => navigate(`/my-bookings/${group.event.id}`)}
            className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 p-6"
          >
            {/* Event Title */}
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">
              {group.event?.title || "Event"}
            </h3>

            {/* Location */}
            {group.event?.location && (
              <p className="text-gray-500 text-sm mb-2">
                📍 {group.event.location}
              </p>
            )}

            {/* Event Date */}
            {group.event?.date_time && (
              <p className="text-gray-500 text-sm mb-4">
                📅 {new Date(group.event.date_time).toLocaleString()}
              </p>
            )}

            {/* Seats Section */}
            <div className="mt-4">
              <p className="text-gray-700 font-semibold mb-2">
                🎫 Seats Booked ({group.seats.length})
              </p>

              <div className="flex flex-wrap gap-2">
                {group.seats.map((seat, i) => (
                  <span
                    key={i}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold"
                  >
                    {seat}
                  </span>
                ))}
              </div>
            </div>

            {/* Status Footer */}
            <div className="flex justify-between items-center mt-6">
              <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700">
                Confirmed
              </span>

              <span className="text-sm text-gray-400">
                {group.seats.length} Seat(s)
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyBookings;