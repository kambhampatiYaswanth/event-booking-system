import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Login from "./Login";
import Events from "./Events";
import Seats from "./Seats";
import MyBookings from "./MyBookings";
import Navbar from "./Navbar";
import PrivateRoute from "./PrivateRoute";
import Payment from "./Payment";
import Register from "./Register";
import MyBookingSeats from "./MyBookingSeats";
function AppContent() {
  const location = useLocation();
  const token = localStorage.getItem("access");

  return (
    <>
      {/* Show Navbar only if logged in AND not on login page */}
      {token && location.pathname !== "/" && <Navbar />}

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/payment/:seatId" element={<Payment />} />
        <Route path="/register" element={<Register />} />
        <Route path="/my-bookings/:eventId" element={<MyBookingSeats />} />
        <Route
          path="/events"
          element={
            <PrivateRoute>
              <Events />
            </PrivateRoute>
          }
        />

        <Route path="/events/:id/seats" element={<Seats />} />

        <Route
          path="/my-bookings"
          element={
            <PrivateRoute>
              <MyBookings />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;