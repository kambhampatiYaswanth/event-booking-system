import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";


function Events() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");  
  const location = useLocation();

  useEffect(() => {
  const fetchEvents = async () => {

    try {

      const response = await axios.get(
        "https://event-booking-backend-wx17.onrender.com/api/events/"
      );

      setEvents(response.data);

    } catch (error) {

      console.error("Error fetching events:", error);

    }

  };

    fetchEvents();
  }, [location]);
    const filteredEvents = events.filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesLocation =
        locationFilter === "" ||
        event.location.toLowerCase().includes(locationFilter.toLowerCase());

      const matchesDate =
        dateFilter === "" ||
        new Date(event.date_time).toDateString() ===
          new Date(dateFilter).toDateString();

      return matchesSearch && matchesLocation && matchesDate;
    });  

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-10">

      {/* Page Title */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-wide">
          🎟 Explore Events
        </h1>
        <p className="text-gray-600 mt-2">
          Book your favorite event in just a few clicks
        </p>
      </div>
      {/* Search & Filters */}
      <div className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Search by Title */}
        <input
          type="text"
          placeholder="🔍 Search by event title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-800"
        />

        {/* Filter by Location */}
        <input
          type="text"
          placeholder="📍 Filter by location..."
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-800"
        />

        {/* Filter by Date */}
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-800"
        />

      </div>
      {/* Event Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">

        {filteredEvents.map((event) => {
          console.log("Event object:", event);
          const seatsLeft = event.available_seats;
          const isAlmostFull = seatsLeft < 5;
          
          return (
            <div
              key={event.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition duration-300 transform hover:-translate-y-2 overflow-hidden"
            >
              {/* Card Content */}
              <div className="p-6 flex flex-col justify-between h-full">

                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                    {event.title}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4">
                    {event.description}
                  </p>

                  <div className="text-sm text-gray-500 space-y-1">
                    <p>📍 {event.location}</p>
                    <p>🗓 {new Date(event.date_time).toLocaleString()}</p>
                  </div>
                </div>
              
                {/* Seats Info */}
                <div className="mt-6 flex items-center justify-between">

                  <span
                    className={`text-sm font-semibold px-3 py-1 rounded-full ${
                      isAlmostFull
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {event.seats_left} Seats Left
                  </span>
                  
                  <button
                    onClick={() => navigate(`/events/${event.id}/seats`)}
                    className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition duration-200"
                  >
                    Book Now
                  </button>

                </div>
              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
}

export default Events;
