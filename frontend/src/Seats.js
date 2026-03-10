import { useEffect, useState } from "react";
import { useParams} from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
function Seats() {
  const { id } = useParams();
  const [timeLeft, setTimeLeft] = useState(300);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const navigate = useNavigate();
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
  useEffect(() => {

    if (selectedSeats.length === 0) return;

    setTimeLeft(300);

    const timer = setInterval(() => {

      setTimeLeft(prev => {

        if (prev <= 1) {

          clearInterval(timer);
          alert("Seat hold expired!");

          setSelectedSeats([]);

          window.location.reload();

          return 0;
        }

        return prev - 1;

      });

    }, 1000);

    return () => clearInterval(timer);

  }, [selectedSeats]);  

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

      // If seat already selected → UNSELECT
      if (selectedSeats.includes(seatId)) {
        setSelectedSeats(selectedSeats.filter(id => id !== seatId));
        return;
      }

      // Limit 6 seats
      if (selectedSeats.length >= 6) {
        alert("Maximum 6 seats allowed");
        return;
      }

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

        setSelectedSeats([...selectedSeats, seatId]);

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
      {selectedSeats.length > 0 && (
          <button
            onClick={() => navigate("/payment", { state: { seats: selectedSeats, eventId: id } })}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Proceed to Payment
          </button>
        )}
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
      {selectedSeats.length > 0 && (

        <div style={{
          textAlign: "center",
          marginBottom: "20px",
          fontSize: "18px",
          fontWeight: "bold",
          color: "red"
        }}>
          ⏳ Booking Countdown: {Math.floor(timeLeft / 60)}:
          {String(timeLeft % 60).padStart(2, "0")}
        </div>

      )}      

      {/* Seat Grid */}
      <div className="flex justify-center">
        <div className="grid grid-cols-8 gap-5">

          {sortedSeats.map((seat) => {

            let seatStyle = "bg-green-500 hover:scale-110";
            let isDisabled = false;

            if (seat.is_booked) {
              seatStyle = "bg-red-500 cursor-not-allowed";
              isDisabled = true;
            } else if (selectedSeats.includes(seat.id)) {
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


    </div>
  );
}

export default Seats;