import React, { useState, useEffect } from 'react';

function Admin() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem('rentroute_admin_logged_in') === 'true';
  });

  const [adminEmail, setAdminEmail] = useState(() => {
    return localStorage.getItem('rentroute_admin_email') || 'admin@rentroute.com';
  });
  const [adminPassword, setAdminPassword] = useState(() => {
    return localStorage.getItem('rentroute_admin_password') || 'admin123';
  });

  const [loginError, setLoginError] = useState('');
  const [cars, setCars] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loadingCars, setLoadingCars] = useState(false);

  // Add Car Form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('Standard');
  const [type, setType] = useState('Sedan');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('Chandigarh');
  const [image, setImage] = useState('');
  const [seats, setSeats] = useState(5);
  const [fuel, setFuel] = useState('Petrol');
  const [description, setDescription] = useState('');

  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAdminLoggedIn) {
      fetchCars();
      fetchBookings();
    }
  }, [isAdminLoggedIn]);

  const fetchCars = () => {
    setLoadingCars(true);
    fetch('http://localhost:5000/api/cars')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCars(data);
        }
      })
      .catch((err) => console.error('Error fetching cars:', err))
      .finally(() => setLoadingCars(false));
  };

  const fetchBookings = () => {
    fetch('http://localhost:5000/api/bookings', {
      headers: {
        'x-admin-email': adminEmail,
        'x-admin-password': adminPassword
      }
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setBookings(data);
        }
      })
      .catch((err) => console.error('Error fetching bookings:', err));
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError('');

    fetch('http://localhost:5000/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: adminEmail, password: adminPassword })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setIsAdminLoggedIn(true);
          localStorage.setItem('rentroute_admin_logged_in', 'true');
          localStorage.setItem('rentroute_admin_email', adminEmail);
          localStorage.setItem('rentroute_admin_password', adminPassword);
        } else {
          setLoginError(data.error || 'Invalid admin credentials');
        }
      })
      .catch(() => {
        setLoginError('Could not connect to backend server.');
      });
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('rentroute_admin_logged_in');
    localStorage.removeItem('rentroute_admin_email');
    localStorage.removeItem('rentroute_admin_password');
  };

  const handleAddCarSubmit = (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    // Form Validation
    if (!name.trim()) {
      setFormError('Car Name is required.');
      return;
    }
    if (!type.trim()) {
      setFormError('Car Type is required.');
      return;
    }
    const parsedPrice = Number(price);
    if (!price || isNaN(parsedPrice) || parsedPrice <= 0) {
      setFormError('Price Per Day must be a number greater than 0.');
      return;
    }
    if (!location.trim()) {
      setFormError('Location is required.');
      return;
    }
    if (!image.trim()) {
      setFormError('Image URL is required.');
      return;
    }

    setIsSubmitting(true);

    const carData = {
      name: name.trim(),
      brand: brand.trim() || 'Standard',
      type: type.trim(),
      price: parsedPrice,
      location: location.trim(),
      image: image.trim(),
      seats: Number(seats) || 5,
      fuel: fuel || 'Petrol',
      description: description.trim() || 'Comfortable vehicle for rent.'
    };

    fetch('http://localhost:5000/api/cars', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-email': adminEmail,
        'x-admin-password': adminPassword
      },
      body: JSON.stringify(carData)
    })
      .then((res) => res.json())
      .then((data) => {
        setIsSubmitting(false);
        if (data.success) {
          setFormSuccess('Car added successfully!');
          // Reset Form
          setName('');
          setBrand('Standard');
          setType('Sedan');
          setPrice('');
          setLocation('Chandigarh');
          setImage('');
          setDescription('');
          // Refresh Car List
          fetchCars();
        } else {
          setFormError(data.error || 'Failed to add car.');
        }
      })
      .catch((err) => {
        setIsSubmitting(false);
        console.error('Add car error:', err);
        setFormError('Server error while adding car.');
      });
  };

  if (!isAdminLoggedIn) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#0f172a' }}>
            Admin Login
          </h2>

          {loginError && <div className="alert-danger">{loginError}</div>}

          <form onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label>Admin Email *</label>
              <input
                type="email"
                className="form-control"
                placeholder="admin@rentroute.com"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Admin Password *</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter admin password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn"
              style={{ width: '100%', padding: '12px', marginTop: '10px' }}
            >
              Login as Admin
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 className="section-title" style={{ margin: 0 }}>Admin Dashboard</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            className="btn"
            style={{ backgroundColor: '#16a34a' }}
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? 'Close Form' : '+ Add Car'}
          </button>
          <button className="btn btn-secondary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Add Car Form */}
      {showAddForm && (
        <div className="booking-form-card" style={{ marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '15px' }}>Add New Car</h3>

          {formError && <div className="alert-danger" style={{ marginBottom: '15px' }}>{formError}</div>}
          {formSuccess && <div className="alert-success" style={{ marginBottom: '15px' }}>{formSuccess}</div>}

          <form onSubmit={handleAddCarSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Car Name *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. XUV700"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Brand</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Mahindra"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Car Type *</label>
                <select
                  className="form-control"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="Hatchback">Hatchback</option>
                  <option value="Luxury">Luxury</option>
                </select>
              </div>

              <div className="form-group">
                <label>Price Per Day (₹) *</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="e.g. 3500"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Location *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Shimla"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Image URL *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="http://localhost:5000/photos/... or web URL"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Seats</label>
                <input
                  type="number"
                  className="form-control"
                  value={seats}
                  onChange={(e) => setSeats(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Fuel Type</label>
                <select
                  className="form-control"
                  value={fuel}
                  onChange={(e) => setFuel(e.target.value)}
                >
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="CNG">CNG</option>
                  <option value="Electric">Electric</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <input
                type="text"
                className="form-control"
                placeholder="Brief car description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn"
              disabled={isSubmitting}
              style={{ width: '100%', padding: '12px', marginTop: '10px' }}
            >
              {isSubmitting ? 'Adding Car...' : 'Add Car'}
            </button>
          </form>
        </div>
      )}

      {/* Fleet Overview */}
      <h3 style={{ marginBottom: '15px', color: '#1e293b' }}>Fleet Inventory ({cars.length})</h3>

      {loadingCars ? (
        <p>Loading car fleet...</p>
      ) : (
        <div style={{ overflowX: 'auto', marginBottom: '40px' }}>
          <table className="confirmation-table" style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>Image</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Car Name</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Type</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Price/Day</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Location</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {cars.map((car) => (
                <tr key={car._id || car.id}>
                  <td style={{ padding: '10px' }}>
                    <img
                      src={car.image}
                      alt={car.name}
                      style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                    />
                  </td>
                  <td style={{ padding: '10px', fontWeight: 'bold' }}>{car.name} ({car.brand})</td>
                  <td style={{ padding: '10px' }}>{car.type}</td>
                  <td style={{ padding: '10px', color: '#16a34a', fontWeight: 'bold' }}>₹{car.price}</td>
                  <td style={{ padding: '10px' }}>{car.location}</td>
                  <td style={{ padding: '10px' }}>
                    <span
                      style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        backgroundColor: car.available !== false ? '#dcfce7' : '#fee2e2',
                        color: car.available !== false ? '#15803d' : '#b91c1c',
                        fontWeight: 'bold'
                      }}
                    >
                      {car.available !== false ? 'Available' : 'Booked'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Bookings Section */}
      <h3 style={{ marginBottom: '15px', color: '#1e293b' }}>Customer Bookings ({bookings.length})</h3>

      {bookings.length === 0 ? (
        <p style={{ color: '#64748b' }}>No customer bookings recorded yet.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="confirmation-table" style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>Booking ID</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Customer</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Car</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Route</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Dates</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Total Price</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id || b.bookingId}>
                  <td style={{ padding: '10px', fontWeight: 'bold', color: '#2563eb' }}>{b.bookingId}</td>
                  <td style={{ padding: '10px' }}>
                    <div><strong>{b.customerName}</strong></div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>{b.email} | {b.phone}</div>
                  </td>
                  <td style={{ padding: '10px' }}>{b.carName} ({b.carBrand})</td>
                  <td style={{ padding: '10px' }}>{b.pickupLocation} &rarr; {b.destination}</td>
                  <td style={{ padding: '10px', fontSize: '13px' }}>{b.pickupDate} to {b.returnDate} ({b.rentalDays}d)</td>
                  <td style={{ padding: '10px', color: '#16a34a', fontWeight: 'bold' }}>₹{b.totalPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Admin;
