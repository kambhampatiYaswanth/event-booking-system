# 🎟 Event Booking System

A full-stack Event Booking System built using Django REST Framework and React.  
The application allows users to register, login securely using JWT authentication, browse events, select seats with real-time locking, confirm bookings, and manage their reservations.

## 🚀 Live Demo

Frontend: https://event-booking-system-1sjc.onrender.com  
Backend API: https://event-booking-backend-wx17.onrender.com  

---

## 🛠 Tech Stack

### Frontend
- React
- React Router
- Axios
- Tailwind CSS

### Backend
- Django
- Django REST Framework
- JWT Authentication (SimpleJWT)
- Gunicorn
- WhiteNoise

### Database
- PostgreSQL (Production)
- Django ORM

### Deployment
- Render (Web Service + Static Site)
- Environment variables configuration

---

## 🔐 Features

- User registration and login (JWT authentication)
- Role-based access (Admin / User)
- Event listing and detailed view
- Seat selection with real-time locking system
- Time-based lock expiration to prevent double booking
- Booking confirmation flow
- User booking history page
- Admin dashboard for managing events and bookings
- Production-ready deployment configuration

---

## 🪑 Seat Locking Mechanism

To prevent double booking:

1. When a user selects a seat:
   - The seat is marked as locked
   - `locked_by` and `locked_at` are stored
2. Lock expires automatically after 5 minutes
3. On confirmation:
   - Seat is marked as booked
   - Lock is released

This ensures concurrency control and prevents race conditions.

---

## 🧠 Architecture Overview

Client (React Frontend)
⬇ HTTP Requests (Axios)
Django REST API
⬇
PostgreSQL Database

- React handles UI and state management
- Django handles business logic and API endpoints
- PostgreSQL stores relational data
- JWT ensures stateless authentication

---

## 🔑 Authentication Flow

1. User logs in with email & password
2. Backend validates credentials
3. JWT access token is issued
4. Frontend stores token in localStorage
5. Protected API calls include:



---

## ⚙️ Production Setup

- DEBUG=False in production
- Environment variables for SECRET_KEY and DATABASE_URL
- Static files served using WhiteNoise
- Gunicorn as WSGI server
- Automated migrations on startup

---

## 📦 Installation (Local Setup)

### Backend

---

## ⚙️ Production Setup

- DEBUG=False in production
- Environment variables for SECRET_KEY and DATABASE_URL
- Static files served using WhiteNoise
- Gunicorn as WSGI server
- Automated migrations on startup

---
git clone <repo-url>
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver


### Frontend


cd frontend
npm install
npm start


---

## 📚 What I Learned

- Full-stack architecture design
- REST API development
- JWT authentication
- Relational database modeling
- Concurrency control (seat locking)
- Production deployment & debugging
- Environment variable management
- CORS configuration

---

## 📌 Future Improvements

- Stripe payment integration
- Redis-based locking for scalability
- Docker containerization
- CI/CD pipeline integration
- Performance optimization & caching

---

## 👨‍💻 Author

K.Yaswanth Sai Kishore 
Full Stack Developer
