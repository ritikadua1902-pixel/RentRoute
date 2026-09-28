import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

function getTodayISO() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function Booking() {
  const { id } = useParams()
  const navigate = useNavigate()
  const todayISO = getTodayISO()

  const [car, setCar] = useState(null)
  const [loading, setLoading] = useState(true)
  const [customerName, setCustomerName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [pickupLocation, setPickupLocation] = useState('')
  const [destination, setDestination] = useState('')
  const [pickupSuggestions, setPickupSuggestions] = useState([])
  const [destinationSuggestions, setDestinationSuggestions] = useState([])
  const [selectedPickup, setSelectedPickup] = useState(null)
  const [selectedDestination, setSelectedDestination] = useState(null)
  const [pickupDate, setPickupDate] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const user = localStorage.getItem("user")

    if (!user) {
      navigate('/login')
      return
    }

    fetch(`http://localhost:5000/api/cars/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) {
          setCar(data)
        } else {
          return fetch('http://localhost:5000/api/cars')
            .then((res) => res.json())
            .then((cars) => {
              const selectedCar = Array.isArray(cars)
                ? cars.find(
                    (c) =>
                      String(c._id || c.id) === String(id)
                  )
                : null

              setCar(selectedCar)
            })
        }
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [id, navigate])

  const handlePickupDateChange = (e) => {
    const selected = e.target.value
    setPickupDate(selected)
    setErrorMessage('')

    if (selected && selected < todayISO) {
      setErrorMessage("Pickup date cannot be before today's date.")
    } else if (
      selected &&
      returnDate &&
      returnDate < selected
    ) {
      setErrorMessage(
        "Return date cannot be before the pickup date."
      )
    }
  }

  const handleReturnDateChange = (e) => {
    const selected = e.target.value
    setReturnDate(selected)
    setErrorMessage('')

    if (pickupDate && selected < pickupDate) {
      setErrorMessage(
        "Return date cannot be before the pickup date."
      )
    }
  }

  const calculatePricing = () => {
    let rentalDays = 1

    if (
      pickupDate &&
      returnDate &&
      returnDate >= pickupDate
    ) {
      const start = new Date(pickupDate)
      const end = new Date(returnDate)

      const days = Math.ceil(
        (end - start) / (1000 * 60 * 60 * 24)
      )

      if (days > 0) {
        rentalDays = days
      }
    }

    const dailyPrice = car ? car.price : 0
    const basePrice = dailyPrice * rentalDays
    const serviceCharge = 100
    const totalPrice = basePrice + serviceCharge

    return {
      rentalDays,
      dailyPrice,
      basePrice,
      serviceCharge,
      totalPrice
    }
  }

  const pricing = calculatePricing()

  const searchLocation = async (text, type) => {
    if (text.trim().length < 3) {
      if (type === "pickup") {
        setPickupSuggestions([])
      } else {
        setDestinationSuggestions([])
      }

      return
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/location-search?text=${encodeURIComponent(text)}`
      )

      const data = await response.json()

      if (data.success) {
        if (type === "pickup") {
          setPickupSuggestions(data.locations)
        } else {
          setDestinationSuggestions(data.locations)
        }
      }
    } catch (error) {
      console.error("Location search error:", error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')

    const savedUser = localStorage.getItem("user")

    if (!savedUser) {
      navigate('/login')
      return
    }

    const user = JSON.parse(savedUser)

    if (
      !customerName ||
      !email ||
      !phone ||
      !pickupLocation ||
      !destination ||
      !pickupDate ||
      !returnDate
    ) {
      setErrorMessage('Please fill in all required fields.')
      return
    }

    if (phone.length < 10) {
      setErrorMessage(
        "Phone number must be at least 10 digits."
      )
      return
    }

    if (pickupDate < todayISO) {
      setErrorMessage(
        "Pickup date cannot be before today's date."
      )
      return
    }

    if (returnDate < pickupDate) {
      setErrorMessage(
        "Return date cannot be before the pickup date."
      )
      return
    }

    if (!car) {
      setErrorMessage(
        'Car information missing. Please re-select a car.'
      )
      return
    }

    if (!selectedPickup) {
      setErrorMessage(
        "Please select a valid pickup location from the suggestions."
      )
      return
    }

    if (!selectedDestination) {
      setErrorMessage(
        "Please select a valid destination from the suggestions."
      )
      return
    }

    setIsSubmitting(true)

    try {
      const bookingPayload = {
        userId: user.id,
        customerName,
        email,
        phone,
        pickupLocation,
        destination,
        pickupDate,
        returnDate,
        carId: car._id || car.id
      }

      const response = await fetch(
        "http://localhost:5000/api/bookings",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(bookingPayload)
        }
      )

      const data = await response.json()

      setIsSubmitting(false)

      if (data.success) {
        navigate('/confirmation', {
          state: {
            booking: data.booking
          }
        })
      } else {
        setErrorMessage(
          data.error ||
            'Booking failed. Please check your inputs.'
        )
      }
    } catch (error) {
      setIsSubmitting(false)

      console.error(
        'Booking submission error:',
        error
      )

      setErrorMessage(
        'Server error while processing booking. Please try again.'
      )
    }
  }

  if (loading) {
    return (
      <div className="container">
        <p
          style={{
            textAlign: 'center',
            padding: '40px'
          }}
        >
          Loading car details...
        </p>
      </div>
    )
  }

  if (!car) {
    return (
      <div className="container">
        <h2
          style={{
            textAlign: 'center',
            padding: '40px'
          }}
        >
          Car not found.
        </h2>
      </div>
    )
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
                onChange={(e) =>
                  setCustomerName(e.target.value)
                }
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
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                />
              </div>

              <div className="form-group">
                <label>Phone Number *</label>

                <input
                  type="tel"
                  className="form-control"
                  placeholder="Phone number"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value)
                  }
                />
              </div>

            </div>

            <h3>2. Journey Details</h3>

            <div className="form-row">

              <div
                className="form-group"
                style={{ position: 'relative' }}
              >
                <label>Pickup Location *</label>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter pickup location"
                  value={pickupLocation}
                  onChange={(e) => {
                    const value = e.target.value

                    setPickupLocation(value)
                    setSelectedPickup(null)

                    searchLocation(
                      value,
                      "pickup"
                    )
                  }}
                />

                {pickupSuggestions.length > 0 && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      background: 'white',
                      border: '1px solid #ddd',
                      zIndex: 10,
                      maxHeight: '200px',
                      overflowY: 'auto'
                    }}
                  >
                    {pickupSuggestions.map(
                      (location, index) => (
                        <div
                          key={index}
                          onClick={() => {
                            setPickupLocation(
                              location.label
                            )

                            setSelectedPickup(
                              location
                            )

                            setPickupSuggestions([])

                            setErrorMessage('')
                          }}
                          style={{
                            padding: '10px',
                            cursor: 'pointer',
                            borderBottom:
                              '1px solid #eee'
                          }}
                        >
                          {location.label}
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>

              <div
                className="form-group"
                style={{ position: 'relative' }}
              >
                <label>Destination *</label>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter destination"
                  value={destination}
                  onChange={(e) => {
                    const value = e.target.value

                    setDestination(value)
                    setSelectedDestination(null)

                    searchLocation(
                      value,
                      "destination"
                    )
                  }}
                />

                {destinationSuggestions.length > 0 && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      background: 'white',
                      border: '1px solid #ddd',
                      zIndex: 10,
                      maxHeight: '200px',
                      overflowY: 'auto'
                    }}
                  >
                    {destinationSuggestions.map(
                      (location, index) => (
                        <div
                          key={index}
                          onClick={() => {
                            setDestination(
                              location.label
                            )

                            setSelectedDestination(
                              location
                            )

                            setDestinationSuggestions([])

                            setErrorMessage('')
                          }}
                          style={{
                            padding: '10px',
                            cursor: 'pointer',
                            borderBottom:
                              '1px solid #eee'
                          }}
                        >
                          {location.label}
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>

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
              <div
                className="alert-danger"
                style={{
                  marginBottom: '20px'
                }}
              >
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
              {isSubmitting
                ? 'Booking...'
                : 'Confirm & Book Now'}
            </button>

          </form>
        </div>

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

            <span>
              {pricing.rentalDays} Day(s)
            </span>
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
  )
}

export default Booking