import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function MyBookingSeats() {
  const { eventId } = useParams();
  const [seats, setSeats] = useState([]);
  const [mySeatIds, setMySeatIds] = useState([]);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("access");

        // Get all seats for event
        const seatResponse = await axios.get(
          `https://event-booking-backend-wx17.onrender.com/api/events/${eventId}/seats/`
        );

        setSeats(seatResponse.data);

        // Get my bookings
        const bookingResponse = await axios.get(
          "https://event-booking-backend-wx17.onrender.com/api/bookings/my-bookings/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Full booking data:", bookingResponse.data);
        console.log("First booking full:", bookingResponse.data[0]);

        const bookedSeatIdsForEvent = bookingResponse.data
        .filter(b => Number(b.event.id) === Number(eventId))
        .flatMap(b => b.seats.map(seatId => Number(seatId)));

        setMySeatIds(bookedSeatIdsForEvent);

      } catch (error) {
        console.error(error);
      }
      
    };

    fetchData();
  }, [eventId]);
  
  // Sort seats properly
  const sortedSeats = [...seats].sort((a, b) => {
    const numA = parseInt(a.seat_number.replace(/\D/g, ""));
    const numB = parseInt(b.seat_number.replace(/\D/g, ""));
    return numA - numB;
  });
  
  
  return (
    <div className="min-h-screen bg-gray-900 text-white p-10">
      <h1 className="text-3xl font-bold text-center mb-10">
        🎟 Your Seats Overview
      </h1>

      <div className="flex justify-center">
        <div className="grid grid-cols-8 gap-4">
            
        {sortedSeats.map(seat => {

        const isMySeat = mySeatIds.includes(seat.id);

        const backgroundColor = isMySeat
            ? "bg-blue-500"
            : "bg-gray-500";

        return (
            <div
            key={seat.id}
            className={`${backgroundColor} w-12 h-12 rounded-lg text-white flex items-center justify-center`}
            >
            {seat.seat_number}
            </div>
        );
        })}
        </div>
      </div>

      {/* Legend */}
        <div className="flex justify-center mt-10 space-x-6">
        <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span>Your Seats</span>
        </div>
        <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-600 rounded"></div>
            <span>Other Seats</span>
        </div>
        </div>
    </div>
  );
}

export default MyBookingSeats;