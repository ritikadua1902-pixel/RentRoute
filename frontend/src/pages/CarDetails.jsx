import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function CarDetails() {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch cars from API and find selected car
    fetch('http://localhost:5000/api/cars')
      .then((res) => res.json())
      .then((data) => {
        const foundCar = data.find((c) => c.id === parseInt(id));
        setCar(foundCar);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching car details:', err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="container"><p style={{ textAlign: 'center', padding: '40px' }}>Loading car details...</p></div>;
  }

  if (!car) {
    return (
      <div className="container">
        <h2>Car Not Found</h2>
        <p>The requested car does not exist.</p>
        <Link to="/cars" className="btn" style={{ marginTop: '15px' }}>Back to Cars</Link>
      </div>
    );
  }

  return (
    <div className="container">
      <Link to="/cars" style={{ color: '#2563eb', fontWeight: 'bold', display: 'inline-block', marginBottom: '20px' }}>
        &larr; Back to All Cars
      </Link>

      <div className="details-container">
        <img src={car.image} alt={car.name} className="details-image" />

        <div className="details-info">
          <h2>{car.name}</h2>
          <p className="details-brand">{car.brand} - {car.type}</p>

          <div className="spec-grid">
            <div className="spec-item">
              <span className="spec-label">Body Type: </span>
              <span className="spec-value">{car.type}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Capacity: </span>
              <span className="spec-value">{car.seats} Seats</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Fuel Type: </span>
              <span className="spec-value">{car.fuel}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Daily Rent: </span>
              <span className="spec-value">₹{car.price} / day</span>
            </div>
          </div>

          <p className="details-description">{car.description}</p>

          <Link to={`/booking/${car.id}`} className="btn" style={{ width: '100%', padding: '12px', fontSize: '16px' }}>
            Book This Car
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CarDetails;
