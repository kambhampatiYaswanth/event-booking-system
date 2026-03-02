import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function Payment() {
  const { seatId } = useParams();
  const navigate = useNavigate();

  const handlePayment = async () => {
    try {
      const token = localStorage.getItem("access");

      await axios.post(
        "https://event-booking-backend-wx17.onrender.com/api/bookings/confirm-booking/",
        { seat_id: seatId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Payment Successful! Booking Confirmed 🎉");

      navigate("/events");

    } catch (error) {
      alert("Payment Failed.");
      console.error(error);
    }
  };

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h2>Payment Page</h2>
      <p>Seat ID: {seatId}</p>

      <button
        onClick={handlePayment}
        style={{
          padding: "15px 30px",
          backgroundColor: "green",
          color: "white",
          fontSize: "16px",
          border: "none",
          borderRadius: "8px",
        }}
      >
        Pay Now
      </button>
    </div>
  );
}

export default Payment;