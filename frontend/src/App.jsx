import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Cars from './pages/Cars';
import CarDetails from './pages/CarDetails';
import Booking from './pages/Booking';
import Confirmation from './pages/Confirmation';
import Auth from './pages/Auth';

function App() {
  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />

        <main style={{ flexGrow: 1, padding: '20px 0' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cars" element={<Cars />} />
            <Route path="/cars/:id" element={<CarDetails />} />
            <Route path="/booking/:id" element={<Booking />} />
            <Route path="/confirmation" element={<Confirmation />} />
            <Route path="/auth" element={<Auth />} />
          </Routes>
        </main>

        <footer className="footer">
          <p>© 2026 RentRoute - Car Rental System. Student Project Evaluation.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;

