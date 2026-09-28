import React from 'react';
import { Link } from 'react-router-dom';

function CarCard({ car }) {
  const carId = car._id || car.id;

  return (
    <div className="car-card">
      <img src={car.image} alt={car.name} />
      <div className="car-card-body">
        <h3 className="car-title">{car.name}</h3>
        <p className="car-brand">{car.brand} - {car.type}</p>

        <div className="car-details-list">
          <span>Seats: <strong>{car.seats || 5}</strong></span>
          <span>Fuel: <strong>{car.fuel || 'Petrol'}</strong></span>
        </div>

        <div className="car-price">
          ₹{car.price} <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 'normal' }}>/ day</span>
        </div>

        <Link to={`/cars/${carId}`} className="btn">
          View Details
        </Link>
      </div>
    </div>
  );
}

export default CarCard;
