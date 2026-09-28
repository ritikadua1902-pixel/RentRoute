# RentRoute

RentRoute is a simple car rental web application where users can view available cars, select a car, enter pickup and return details, calculate routes, and confirm a booking.

## Features

* View available cars
* View car details
* Select pickup and return dates
* Validate booking dates
* Calculate route using OpenRouteService
* Calculate rental price
* Confirm booking
* Simple login/signup pages

## Technologies Used

### Frontend

* React
* CSS
* JavaScript

### Backend

* Node.js
* Express.js

### APIs

* OpenRouteService API

## Project Structure

```text
RentRoute/
│
├── backend/
│   ├── photos/
│   ├── server.js
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

The frontend will run on the Vite development server.

## Note

The OpenRouteService API key is stored in the `.env` file and should not be uploaded to GitHub.

## Future Improvements

* Online payment
* Better authentication
* Admin panel
* Database integration
* Booking history
