import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function MyBookingSeats() {

  const { bookingId } = useParams();

  const [seats, setSeats] = useState([]);
  const navigate = useNavigate();
  const [mySeatIds, setMySeatIds] = useState([]);

useEffect(() => {

  const fetchData = async () => {

    try {

      const token = localStorage.getItem("access");

      // Get all bookings
      const bookingResponse = await axios.get(
        "https://event-booking-backend-wx17.onrender.com/api/bookings/my-bookings/",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const booking = bookingResponse.data.find(
        b => b.id === Number(bookingId)
      );
      console.log("BOOKING DATA:", booking);
      console.log("BOOKING SEATS:", booking.seats);
      if (!booking) {
        console.log("Booking not found");
        return;
      }

      const eventId = booking.event.id;

      console.log("Event ID:", eventId);

      // Fetch seats for this event
      const seatResponse = await axios.get(
        `https://event-booking-backend-wx17.onrender.com/api/events/${eventId}/seats/`
      );

      console.log("Seats:", seatResponse.data);

      setSeats(seatResponse.data);

      setMySeatIds(booking.seats);

    } catch (error) {

      console.error(error);

    }

  };

  fetchData();

}, [bookingId]);

  const sortedSeats = [...seats].sort((a, b) => {
    const numA = parseInt(a.seat_number.replace(/\D/g, ""));
    const numB = parseInt(b.seat_number.replace(/\D/g, ""));
    return numA - numB;
  });

  const downloadTicket = async () => {

    const token = localStorage.getItem("access");
    console.log("Downloading ticket for booking:", bookingId);
    const response = await axios.get(
      `https://event-booking-backend-wx17.onrender.com/api/bookings/download-ticket/${bookingId}/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      }
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));

    const link = document.createElement("a");

    link.href = url;
    link.setAttribute("download", "ticket.pdf");

    document.body.appendChild(link);

    link.click();
  }; 
  const cancelBooking = async () => {

  const confirmCancel = window.confirm("Are you sure you want to cancel this booking?");

  if (!confirmCancel) return;

  try {

    const token = localStorage.getItem("access");

    await axios.post(
      `https://event-booking-backend-wx17.onrender.com/api/bookings/cancel-booking/${bookingId}/`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("Booking cancelled");

    navigate("/my-bookings");

  } catch (error) {

    alert("Cancellation failed");

  }

}; 

  return (
    <div className="min-h-screen bg-gray-900 text-white p-10">

      <h1 className="text-3xl font-bold text-center mb-10">
        🎟 Your Seat Overview
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
      <button
        onClick={downloadTicket}
        className="bg-green-500 px-6 py-2 rounded-lg mt-10"
      >
        Download Ticket
      </button>
      <button
        onClick={cancelBooking}
        className="bg-red-500 px-6 py-2 rounded-lg mt-4 ml-4"
      >
        Cancel Booking
      </button>      
      <div className="flex justify-center mt-10 space-x-6">

        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span>Your Seats</span>
        </div>

        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gray-500 rounded"></div>
          <span>Other Seats</span>
        </div>

      </div>

    </div>
  );
}

export default MyBookingSeats;