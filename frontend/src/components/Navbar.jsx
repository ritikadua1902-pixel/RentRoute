import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    setUser(savedUser ? JSON.parse(savedUser) : null);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">RentRoute</Link>
      </div>
      <ul className="navbar-links" style={{ alignItems: 'center' }}>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/cars">Cars</Link></li>
        <li><Link to="/admin">Admin</Link></li>
        {!user ? (
  <li><Link to="/login">Login / Sign Up</Link></li>
) : (
  <>
    <li><Link to="/my-bookings">My Bookings</Link></li>
    <li><span>Hello, {user.name}</span></li>
    <li>
      <button
        onClick={handleLogout}
        className="btn btn-secondary"
        style={{ padding: '6px 14px' }}
      >
        Logout
      </button>
    </li>
  </>
)}
        <li>
          <Link
            to="/cars"
            className="btn btn-secondary"
            style={{ padding: '6px 14px', color: '#fff' }}
          >
            Book Now
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;