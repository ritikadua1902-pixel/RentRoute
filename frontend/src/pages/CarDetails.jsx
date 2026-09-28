import React, { useState, useEffect } from 'react';

import { useParams, Link, useNavigate } from 'react-router-dom';

function CarDetails() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [car, setCar] = useState(null);

  const [loading, setLoading] = useState(true);
  const [showLoginMessage, setShowLoginMessage] = useState(false);

  useEffect(() => {

    fetch(`http://localhost:5000/api/cars/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if(data && !data.error) {
          setCar(data);
        } else {
          return fetch('http://localhost:5000/api/cars')
            .then((res) => res.json())
            .then((cars) => {
              const found = Array.isArray(cars)? cars.find((c) => String(c._id || c.id) === String(id)): null;
              setCar(found || null);
            });
       }
      })

      .catch((err) => {
        console.error('Error fetching car details:', err);

      })

      .finally(() => {

        setLoading(false);

      });

  }, [id]);

  if (loading) {

    return (

      <div className="container">

        <p style={{ textAlign: 'center', padding: '40px' }}>Loading car details...</p>

      </div>

    );

  }

  if (!car) {

    return (

      <div className="container">

        <h2>Car Not Found</h2>

        <p>The requested car does not exist.</p>

        <Link to="/cars" className="btn" style={{ marginTop: '15px' }}>

          Back to Cars

        </Link>

      </div>

    );

  }

  const carId = car._id || car.id;

  const handleBooking = () => {

    const user = localStorage.getItem("user");

    if (!user) {

      setShowLoginMessage(true);

      return;

    }

    navigate(`/booking/${carId}`);

  };

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

              <span className="spec-value">{car.seats || 5} Seats</span>

            </div>

            <div className="spec-item">

              <span className="spec-label">Fuel Type: </span>

              <span className="spec-value">{car.fuel || 'Petrol'}</span>

            </div>

            <div className="spec-item">

              <span className="spec-label">Location: </span>

              <span className="spec-value">{car.location || 'Chandigarh'}</span>

            </div>

            <div className="spec-item">

              <span className="spec-label">Daily Rent: </span>

              <span className="spec-value">₹{car.price} / day</span>

            </div>

          </div>

          <p className="details-description">{car.description || 'Reliable car for rent.'}</p>

          <button
  onClick={handleBooking}
  className="btn"
  style={{ width: '100%', padding: '12px', fontSize: '16px' }}
>
  Book This Car
</button>

{showLoginMessage && (
  <div
    className="alert-danger"
    style={{ marginTop: '15px', textAlign: 'center' }}
  >
    Please login or sign up to book this car.
    <br />
    <button
      type="button"
      className="btn"
      style={{ marginTop: '10px' }}
      onClick={() => navigate('/login')}
    >
      Login / Sign Up
    </button>
  </div>
)}

        </div>

      </div>

    </div>

  );

}

export default CarDetails;