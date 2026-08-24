import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';

function Confirmation() {
  const location = useLocation();
  const booking = location.state?.booking;

  useEffect(() => {
    if (booking) {
      // Save booking details to localStorage
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
          <p>Please select a car, find a route, and submit a booking request first.</p>
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
        <p style={{ color: '#64748b' }}>Your car rental reservation with route-based pricing has been received successfully.</p>

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
              <td className="label">Selected Route</td>
              <td className="value">{booking.selectedRouteName || 'Route 1 (Recommended)'}</td>
            </tr>
            {booking.selectedRoutePath && (
              <tr>
                <td className="label">Route Path</td>
                <td className="value" style={{ color: '#2563eb', fontSize: '13px' }}>{booking.selectedRoutePath}</td>
              </tr>
            )}
            <tr>
              <td className="label">Distance</td>
              <td className="value">{booking.distance} km</td>
            </tr>
            <tr>
              <td className="label">Travel Time</td>
              <td className="value">{booking.durationText}</td>
            </tr>
            <tr>
              <td className="label">Distance Charge</td>
              <td className="value">₹{booking.distanceCharge}</td>
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
              <td className="label">Total Price</td>
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
