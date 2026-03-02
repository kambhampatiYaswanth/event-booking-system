import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

function Seats() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [seats, setSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);

  // Fetch seats
  useEffect(() => {
    if (!id) return;

    const fetchSeats = async () => {
      try {
        const response = await axios.get(
          `https://event-booking-backend-wx17.onrender.com/api/events/${id}/seats/`
        );
        setSeats(response.data);
      } catch (error) {
        console.error("Seat fetch failed:", error);
      }
    };

    fetchSeats();
  }, [id]);

  // Get logged in user
  let userId = null;
  try {
    const token = localStorage.getItem("access");
    if (token) {
      const decoded = jwtDecode(token);
      userId = Number(decoded.user_id);
    }
  } catch (error) {
    console.error("Token decode failed:", error);
  }

  const handleSeatClick = async (seatId) => {
    try {
      const token = localStorage.getItem("access");

      await axios.post(
        "https://event-booking-backend-wx17.onrender.com/api/bookings/lock-seat/",
        { seat_id: seatId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSelectedSeat(seatId);

      const response = await axios.get(
        `https://event-booking-backend-wx17.onrender.com/api/events/${id}/seats/`
      );
      setSeats(response.data);
    } catch (error) {
      alert("Seat could not be locked.");
    }
  };

  const totalSeats = seats.length;
  const bookedSeats = seats.filter((seat) => seat.is_booked).length;
  const lockedSeats = seats.filter(
    (seat) => seat.locked_by !== null && !seat.is_booked
  ).length;
  const availableSeats = totalSeats - bookedSeats - lockedSeats;
  const sortedSeats = [...seats].sort((a, b) => {
    const rowA = a.seat_number.match(/[A-Za-z]+/)[0];
    const rowB = b.seat_number.match(/[A-Za-z]+/)[0];

    const numA = parseInt(a.seat_number.match(/\d+/)[0], 10);
    const numB = parseInt(b.seat_number.match(/\d+/)[0], 10);

    if (rowA === rowB) {
      return numA - numB;
    }

    return rowA.localeCompare(rowB);
  });  
  return (
    <div className="min-h-screen bg-gray-900 text-white p-10">

      {/* Title */}
      <h1 className="text-4xl font-bold text-center mb-10">
        🎬 Select Your Seat
      </h1>

      {/* Seat Stats */}
      <div className="flex justify-center space-x-8 mb-10 text-sm font-semibold">
        <span>Total: {totalSeats}</span>
        <span className="text-green-400">Available: {availableSeats}</span>
        <span className="text-yellow-400">Locked: {lockedSeats}</span>
        <span className="text-red-500">Booked: {bookedSeats}</span>
      </div>

      {/* SCREEN */}
      <div className="flex justify-center mb-16">
        <div className="w-2/3 bg-gradient-to-r from-gray-300 to-gray-500 text-black text-center py-3 rounded-xl shadow-lg">
          SCREEN
        </div>
      </div>

      {/* Seat Grid */}
      <div className="flex justify-center">
        <div className="grid grid-cols-8 gap-5">

          {sortedSeats.map((seat) => {

            let seatStyle = "bg-green-500 hover:scale-110";
            let isDisabled = false;

            if (seat.is_booked) {
              seatStyle = "bg-red-500 cursor-not-allowed";
              isDisabled = true;
            } else if (selectedSeat === seat.id) {
              seatStyle = "bg-blue-500 scale-110";
            } else if (seat.locked_by !== null) {
              const lockedBy = Number(seat.locked_by);
              if (lockedBy === userId) {
                seatStyle = "bg-blue-500";
              } else {
                seatStyle = "bg-yellow-500 cursor-not-allowed";
                isDisabled = true;
              }
            }

            return (
              <button
                key={seat.id}
                disabled={isDisabled}
                onClick={() => handleSeatClick(seat.id)}
                className={`${seatStyle} w-12 h-12 rounded-lg transition transform duration-200 text-sm font-bold`}
              >
                {seat.seat_number}
              </button>
            );
          })}

        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center space-x-8 mt-12 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-yellow-500 rounded"></div>
          <span>Locked</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span>Booked</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span>Selected</span>
        </div>
      </div>

      {/* Confirm Button */}
      {selectedSeat && (
        <div className="flex justify-center mt-10">
          <button
            onClick={() => navigate(`/payment/${selectedSeat}`)}
            className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-xl font-semibold shadow-lg transition duration-300"
          >
            Confirm & Proceed
          </button>
        </div>
      )}
    </div>
  );
}

export default Seats;