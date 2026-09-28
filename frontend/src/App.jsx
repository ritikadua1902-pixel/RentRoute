import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Cars from './pages/Cars';
import CarDetails from './pages/CarDetails';
import Booking from './pages/Booking';
import Confirmation from './pages/Confirmation';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Admin from './pages/Admin';
import MyBookings from './pages/MyBookings';
import ProtectedRoute from './components/ProtectedRoute';

function App() {

  return (

    <Router>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh'
        }}
      >

        <Navbar />

        <main
          style={{
            flexGrow: 1,
            padding: '20px 0'
          }}
        >

          <Routes>

            <Route path="/" element={<Home />} />

            <Route path="/cars" element={<Cars />} />

            <Route path="/cars/:id" element={<CarDetails />} />

            <Route path="/booking/:id" element={
              <ProtectedRoute>
                <Booking />
               </ProtectedRoute>} />

            <Route path="/confirmation" element={<Confirmation />} />

            <Route path="/login" element={<Login />} />

            <Route path="/signup" element={<Signup />} />

            <Route path="/my-bookings" element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
              } />

            <Route path="/admin" element={<Admin />} />

          </Routes>

        </main>

        <footer className="footer">
          <p>
            © 2026 RentRoute - Car Rental System. Student Project Evaluation.
          </p>
        </footer>

      </div>

    </Router>
  );
}

export default App;