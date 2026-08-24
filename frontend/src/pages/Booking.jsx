import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);

  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [pickupLocation, setPickupLocation] = useState('');
  const [destination, setDestination] = useState('');

  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');

  // Get selected car
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

  // Calculate rental price
  const calculatePricing = () => {
    let rentalDays = 1;

    if (pickupDate && returnDate) {
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

  // Submit booking
  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !customerName ||
      !email ||
      !phone ||
      !pickupLocation ||
      !destination ||
      !pickupDate ||
      !returnDate
    ) {
      alert('Please fill in all fields.');
      return;
    }

    const booking = {
      customerName,
      email,
      phone,
      pickupLocation,
      destination,
      pickupDate,
      returnDate,
      carName: car.name,
      carBrand: car.brand,
      rentalDays: pricing.rentalDays,
      dailyPrice: pricing.dailyPrice,
      totalPrice: pricing.totalPrice
    };

    console.log('Booking:', booking);

    navigate('/confirmation', {
      state: { booking: booking }
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
                  onChange={(e) =>
                    setPickupLocation(e.target.value)
                  }
                />
              </div>

              <div className="form-group">
                <label>Destination *</label>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter destination"
                  value={destination}
                  onChange={(e) =>
                    setDestination(e.target.value)
                  }
                />
              </div>

            </div>

            <h3>3. Travel Dates</h3>

            <div className="form-row">

              <div className="form-group">
                <label>Pickup Date *</label>

                <input
                  type="date"
                  className="form-control"
                  value={pickupDate}
                  onChange={(e) =>
                    setPickupDate(e.target.value)
                  }
                />
              </div>

              <div className="form-group">
                <label>Return Date *</label>

                <input
                  type="date"
                  className="form-control"
                  value={returnDate}
                  onChange={(e) =>
                    setReturnDate(e.target.value)
                  }
                />
              </div>

            </div>

            <button
              type="submit"
              className="btn"
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '16px'
              }}
            >
              Confirm & Book Now
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