# RentRoute

RentRoute is a simple car rental web application where users can view available cars, select a car, enter pickup and return details, calculate routes, calculate rental prices, and confirm bookings.

## Features

* View available cars
* View detailed information about cars
* User signup and login
* Select pickup and return dates
* Validate booking dates
* Calculate routes using OpenRouteService API
* Calculate rental price based on rental duration
* Confirm bookings
* View personal booking history
* Admin login
* Admin view of all bookings
* Store users, cars, and bookings in MongoDB

## Technologies Used

### Frontend

* React
* JavaScript
* CSS
* React Router
* Leaflet

### Backend

* Node.js
* Express.js
* Mongoose
* MongoDB
* bcrypt
* CORS
* dotenv

### APIs

* OpenRouteService API

## Database

RentRoute uses MongoDB for storing application data.

The main collections are:

* Users
* Cars
* Bookings

Mongoose is used to interact with MongoDB from the Node.js backend.

## Project Structure

```text
RentRoute/

│
├── backend/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── photos/
│   ├── server.js
│   ├── .env
│   └── package.json
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
└── README.md
```

## How to Run

### Backend

```bash
cd backend
npm install
node server.js
```

The backend runs on:

```text
http://localhost:5000
```

### Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs using the Vite development server.

## API Functionality

The backend provides APIs for:

* User signup
* User login
* Fetching available cars
* Creating bookings
* Fetching bookings of a particular user
* Admin login
* Fetching all bookings for the admin
* Route calculation

## Environment Variables

The OpenRouteService API key and other sensitive configuration values are stored in the `.env` file.

The `.env` file should not be uploaded to GitHub.

## Future Improvements

* Online payment integration
* More advanced authentication and authorization
* Improved admin dashboard
* Booking cancellation and modification
* Email/SMS booking notifications
* Improved UI and responsive design
* Deployment for production use
