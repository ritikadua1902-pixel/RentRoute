import React, { useState, useEffect } from 'react';
import CarCard from '../components/CarCard';

function Cars() {
  const [cars, setCars] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch cars list from backend Express API
    fetch('http://localhost:5000/api/cars')
      .then((res) => res.json())
      .then((data) => {
        setCars(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching cars from API:', err);
        setLoading(false);
      });
  }, []);

  // Filter cars based on search input and type filter
  const filteredCars = cars.filter((car) => {
    const matchesSearch =
      car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.brand.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = selectedType === 'All' || car.type === selectedType;

    return matchesSearch && matchesType;
  });

  return (
    <div className="container">
      <h2 className="section-title">Available Cars</h2>

      {/* Search and Filter Controls */}
      <div className="filter-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search car..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="filter-select"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="All">All Types</option>
          <option value="Sedan">Sedan</option>
          <option value="SUV">SUV</option>
          <option value="Hatchback">Hatchback</option>
        </select>
      </div>

      {/* Cars Grid Listing */}
      {loading ? (
        <p style={{ textAlign: 'center', padding: '40px' }}>Loading available cars...</p>
      ) : filteredCars.length > 0 ? (
        <div className="cars-grid">
          {filteredCars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      ) : (
        <p style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
          No cars found matching your criteria.
        </p>
      )}
    </div>
  );
}

export default Cars;
