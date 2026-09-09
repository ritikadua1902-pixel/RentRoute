import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function getTodayISO() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();

  const todayISO = getTodayISO();

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);

  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [pickupLocation, setPickupLocation] = useState('');
  const [destination, setDestination] = useState('');

  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [routeInfoMessage, setRouteInfoMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5000/api/cars')
      .then((res) => res.json())
      .then((data) => {
        const selectedCar = data.find(
          (car) => car.id === parseInt(id)
        );

        setCar(selectedCar);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [id]);

  const handlePickupDateChange = (e) => {
    const selected = e.target.value;
    setPickupDate(selected);
    setErrorMessage('');

    if (selected && selected < todayISO) {
      setErrorMessage("Pickup date cannot be before today's date.");
    } else if (selected && returnDate && returnDate < selected) {
      setErrorMessage("Return date cannot be before the pickup date.");
    }
  };

  const handleReturnDateChange = (e) => {
    const selected = e.target.value;
    setReturnDate(selected);
    setErrorMessage('');

    if (pickupDate && selected < pickupDate) {
      setErrorMessage("Return date cannot be before the pickup date.");
    }
  };

  const handleCheckRoute = () => {
    setRouteInfoMessage('');
    if (!pickupLocation || !destination) {
      setRouteInfoMessage('Please enter both pickup location and destination to check route.');
      return;
    }

    fetch('http://localhost:5000/api/calculate-route', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pickupLocation, destination })
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) {
          setRouteInfoMessage(
            data.error || 'OpenRouteService is currently unavailable. Standard rental rates will apply.'
          );
        } else {
          setRouteInfoMessage('Route information retrieved successfully.');
        }
      })
      .catch(() => {
        setRouteInfoMessage('Unable to connect to route service. Standard rental rates will apply.');
      });
  };

  const calculatePricing = () => {
    let rentalDays = 1;

    if (pickupDate && returnDate && returnDate >= pickupDate) {
      const start = new Date(pickupDate);
      const end = new Date(returnDate);

      const days = Math.ceil(
        (end - start) / (1000 * 60 * 60 * 24)
      );

      if (days > 0) {
        rentalDays = days;
      }
    }

    const dailyPrice = car ? car.price : 0;
    const basePrice = dailyPrice * rentalDays;
    const serviceCharge = 100;

    const totalPrice = basePrice + serviceCharge;

    return {
      rentalDays,
      dailyPrice,
      basePrice,
      serviceCharge,
      totalPrice
    };
  };

  const pricing = calculatePricing();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (
      !customerName ||
      !email ||
      !phone ||
      !pickupLocation ||
      !destination ||
      !pickupDate ||
      !returnDate
    ) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (pickupDate < todayISO) {
      setErrorMessage("Pickup date cannot be before today's date.");
      return;
    }

    if (returnDate < pickupDate) {
      setErrorMessage("Return date cannot be before the pickup date.");
      return;
    }

    setIsSubmitting(true);

    const bookingPayload = {
      customerName,
      email,
      phone,
      pickupLocation,
      destination,
      pickupDate,
      returnDate,
      carId: car.id
    };

    fetch('http://localhost:5000/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bookingPayload)
    })
      .then((res) => res.json())
      .then((data) => {
        setIsSubmitting(false);
        if (data.success) {
          navigate('/confirmation', {
            state: { booking: data.booking }
          });
        } else {
          setErrorMessage(data.error || 'Booking failed. Please check your inputs.');
        }
      })
      .catch((error) => {
        setIsSubmitting(false);
        console.error('Booking submission error:', error);
        setErrorMessage('Server error while processing booking. Please try again.');
      });
  };

  if (loading) {
    return (
      <div className="container">
        <p style={{ textAlign: 'center', padding: '40px' }}>
          Loading car details...
        </p>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="container">
        <h2 style={{ textAlign: 'center', padding: '40px' }}>Car not found.</h2>
      </div>
    );
  }

  return (
    <div className="container">

      <h2 className="section-title">
        Book {car ? car.name : 'Car'}
      </h2>

      <div className="booking-layout">

        <div className="booking-form-card">

          <form onSubmit={handleSubmit}>

            <h3>1. Customer Details</h3>

            <div className="form-group">
              <label>Customer Name *</label>

              <input
                type="text"
                className="form-control"
                placeholder="Enter your full name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>

            <div className="form-row">

              <div className="form-group">
                <label>Email Address *</label>

                <input
                  type="email"
                  className="form-control"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Phone Number *</label>

                <input
                  type="tel"
                  className="form-control"
                  placeholder="Phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

            </div>

            <h3>2. Journey Details</h3>

            <div className="form-row">

              <div className="form-group">
                <label>Pickup Location *</label>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter pickup location"
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Destination *</label>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter destination"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
              </div>

            </div>

            <div style={{ marginBottom: '20px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ fontSize: '13px', padding: '6px 12px' }}
                onClick={handleCheckRoute}
              >
                Check Route Service
              </button>
              {routeInfoMessage && (
                <p style={{ fontSize: '13px', color: '#64748b', marginTop: '6px' }}>
                  {routeInfoMessage}
                </p>
              )}
            </div>

            <h3>3. Travel Dates</h3>

            <div className="form-row">

              <div className="form-group">
                <label>Pickup Date *</label>

                <input
                  type="date"
                  className="form-control"
                  min={todayISO}
                  value={pickupDate}
                  onChange={handlePickupDateChange}
                />
              </div>

              <div className="form-group">
                <label>Return Date *</label>

                <input
                  type="date"
                  className="form-control"
                  min={pickupDate || todayISO}
                  value={returnDate}
                  onChange={handleReturnDateChange}
                />
              </div>

            </div>

            {errorMessage && (
              <div className="alert-danger" style={{ marginBottom: '20px' }}>
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              className="btn"
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '16px',
                opacity: isSubmitting ? 0.7 : 1
              }}
            >
              {isSubmitting ? 'Booking...' : 'Confirm & Book Now'}
            </button>

          </form>

        </div>

        {/* Price Summary */}

        <div className="price-summary-card">

          <h3>Rental Summary</h3>

          <div>
            <strong>{car.name}</strong> ({car.brand})

            <br />

            <span>
              Rate: ₹{car.price} / day
            </span>
          </div>

          <div className="price-row">
            <span>Rental Duration:</span>
            <span>{pricing.rentalDays} Day(s)</span>
          </div>

          <div className="price-row">
            <span>Base Rental:</span>
            <span>
              ₹{pricing.basePrice}
            </span>
          </div>

          <div className="price-row">
            <span>Service Charge:</span>
            <span>
              ₹{pricing.serviceCharge}
            </span>
          </div>

          <div className="price-row total">
            <span>Estimated Total:</span>

            <span>
              ₹{pricing.totalPrice}
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Booking;