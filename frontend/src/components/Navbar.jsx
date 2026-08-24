import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">RentRoute</Link>
      </div>
      <ul className="navbar-links" style={{alignItems:'center'}}>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/cars">Cars</Link>
        </li>
        <li>
          <Link to="/auth">Login / Sign Up</Link>
        </li>
        <li>
          <Link to="/cars" className="btn btn-secondary" style={{padding:'6px 14px',color:'#fff'}}>
            Book Now
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;

