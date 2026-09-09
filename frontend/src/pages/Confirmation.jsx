import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';

function Confirmation() {
  const location = useLocation();
  const booking = location.state?.booking;

  useEffect(() => {
    if (booking) {
      const existingBookings = JSON.parse(localStorage.getItem('rentroute_bookings') || '[]');
      existingBookings.unshift(booking);
      localStorage.setItem('rentroute_bookings', JSON.stringify(existingBookings));
    }
  }, [booking]);

  if (!booking) {
    return (
      <div className="container">
        <div className="confirmation-card">
          <h2>No Booking Information Found</h2>
          <p>Please select a car and submit a booking request first.</p>
          <Link to="/cars" className="btn" style={{ marginTop: '20px' }}>
            Browse Cars
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="confirmation-card">
        <div className="badge-success">Booking Confirmed!</div>
        <h2>Thank You, {booking.customerName}!</h2>
        <p style={{ color: '#64748b' }}>Your car rental reservation has been received and verified successfully.</p>

        <table className="confirmation-table">
          <tbody>
            <tr>
              <td className="label">Booking ID</td>
              <td className="value" style={{ color: '#2563eb' }}>{booking.bookingId}</td>
            </tr>
            <tr>
              <td className="label">Vehicle Booked</td>
              <td className="value">{booking.carName} ({booking.carBrand})</td>
            </tr>
            <tr>
              <td className="label">Journey</td>
              <td className="value">{booking.pickupLocation} &rarr; {booking.destination}</td>
            </tr>
            <tr>
              <td className="label">Pickup Date</td>
              <td className="value">{booking.pickupDate}</td>
            </tr>
            <tr>
              <td className="label">Return Date</td>
              <td className="value">{booking.returnDate} ({booking.rentalDays} Day/s)</td>
            </tr>
            <tr>
              <td className="label">Daily Rate</td>
              <td className="value">₹{booking.dailyPrice} / day</td>
            </tr>
            <tr>
              <td className="label">Base Rental Charge</td>
              <td className="value">₹{booking.basePrice || (booking.dailyPrice * booking.rentalDays)}</td>
            </tr>
            <tr>
              <td className="label">Service Charge</td>
              <td className="value">₹{booking.serviceCharge || 100}</td>
            </tr>
            {booking.distance && (
              <tr>
                <td className="label">Route Distance</td>
                <td className="value">{booking.distance} km</td>
              </tr>
            )}
            <tr>
              <td className="label">Total Amount Paid/Due</td>
              <td className="value" style={{ fontSize: '18px', color: '#16a34a' }}>₹{booking.totalPrice}</td>
            </tr>
          </tbody>
        </table>

        <Link to="/" className="btn" style={{ padding: '10px 24px' }}>
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default Confirmation;

