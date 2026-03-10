import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

function Payment() {

  const location = useLocation();
  const navigate = useNavigate();

  const { seats} = location.state;

  const [timeLeft, setTimeLeft] = useState(300);

  useEffect(() => {

    const timer = setInterval(() => {

      setTimeLeft(prev => {

        if (prev <= 1) {

          clearInterval(timer);
          alert("Payment time expired");

          navigate("/events");

          return 0;
        }

        return prev - 1;

      });

    }, 1000);

    return () => clearInterval(timer);

  }, [navigate]);

  const handlePayment = async () => {

    const token = localStorage.getItem("access");

    await axios.post(
      "https://event-booking-backend-wx17.onrender.com/api/bookings/confirm-booking/",
      {
        seat_ids: seats
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("Payment Successful!");

    navigate("/my-bookings");

  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">

      <h1 className="text-4xl font-bold mb-6">
        Payment Page
      </h1>

      <p className="text-lg mb-6">
        Seats Selected: {seats.join(", ")}
      </p>

      <p className="text-red-400 text-xl mb-6">
        ⏳ Complete Payment In: {Math.floor(timeLeft / 60)}:
        {String(timeLeft % 60).padStart(2, "0")}
      </p>

      <button
        onClick={handlePayment}
        className="bg-green-500 px-6 py-3 rounded-lg text-lg"
      >
        Pay Now
      </button>

    </div>
  );
}

export default Payment;