import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function MyBookings() {

  const navigate = useNavigate()

  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {

    const savedUser = localStorage.getItem("user")

    if (!savedUser) {
      navigate('/login')
      return
    }

    const user = JSON.parse(savedUser)

    fetch(`http://localhost:5000/api/bookings/user/${encodeURIComponent(user.id)}`)
      .then((res) => res.json())
      .then((data) => {

        if (data.success) {
          setBookings(data.bookings)
        } else {
          setError(
            data.error || 'Unable to fetch bookings.'
          )
        }

      })
      .catch((error) => {

        console.error(
          "Error fetching bookings:",
          error
        )

        setError('Unable to connect to server.')

      })
      .finally(() => {
        setLoading(false)
      })

  }, [navigate])

  if (loading) {
    return (
      <div className="container">
        <p
          style={{
            textAlign: 'center',
            padding: '40px'
          }}
        >
          Loading your bookings...
        </p>
      </div>
    )
  }

  return (
    <div className="container">

      <h2 className="section-title">
        My Bookings
      </h2>

      {error && (
        <div
          className="alert-danger"
          style={{
            marginBottom: '20px'
          }}
        >
          {error}
        </div>
      )}

      {!error && bookings.length === 0 && (
        <div
          style={{
            textAlign: 'center',
            padding: '40px'
          }}
        >

          <h3>No Previous Bookings</h3>

          <p>
            You have not made any bookings yet.
          </p>

          <button
            className="btn"
            style={{
              marginTop: '15px'
            }}
            onClick={() => navigate('/cars')}
          >
            Browse Cars
          </button>

        </div>
      )}

      {bookings.map((booking) => (

        <div
          key={booking._id}
          className="booking-form-card"
          style={{
            marginBottom: '20px'
          }}
        >

          <h3>
            {booking.carName} ({booking.carBrand})
          </h3>

          <p>
            <strong>Booking ID:</strong>{' '}
            {booking.bookingId}
          </p>

          <p>
            <strong>Pickup:</strong>{' '}
            {booking.pickupLocation}
          </p>

          <p>
            <strong>Destination:</strong>{' '}
            {booking.destination}
          </p>

          <p>
            <strong>Pickup Date:</strong>{' '}
            {booking.pickupDate}
          </p>

          <p>
            <strong>Return Date:</strong>{' '}
            {booking.returnDate}
          </p>

          <p>
            <strong>Rental Duration:</strong>{' '}
            {booking.rentalDays} Day(s)
          </p>

          <p>
            <strong>Daily Rent:</strong>{' '}
            ₹{booking.dailyPrice}
          </p>

          <p>
            <strong>Service Charge:</strong>{' '}
            ₹{booking.serviceCharge}
          </p>

          <h3>
            Total Amount: ₹{booking.totalPrice}
          </h3>

        </div>

      ))}

    </div>
  )
}

export default MyBookings