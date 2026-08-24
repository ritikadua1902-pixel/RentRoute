import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CarCard from '../components/CarCard';

function Home() {
  const [featuredCars, setFeaturedCars] = useState([]);

  useEffect(() => {
    // Fetch cars from Express API
    fetch('http://localhost:5000/api/cars')
      .then((res) => res.json())
      .then((data) => {
        // Take first 3 cars as featured
        setFeaturedCars(data.slice(0, 3));
      })
      .catch((err) => console.error('Error fetching cars:', err));
  }, []);

  return (
    <div className="container">
      {/* Hero Section */}
      <section className="hero">
        <h1>Rent a Car Easily with RentRoute</h1>
        <p>Find a suitable car, check the rental price and book it for your journey.</p>
        <Link to="/cars" className="btn" style={{ padding: '12px 28px', fontSize: '16px' }}>
          View Cars
        </Link>
      </section>

      {/* Unique Route Feature Section */}
      <section style={{ backgroundColor: '#ffffff', padding: '30px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '40px', textAlign: 'center' }}>
        <h2 style={{ color: '#0f172a', marginBottom: '10px', fontSize: '24px' }}>Plan Your Route Before You Book</h2>
        <p style={{ color: '#64748b', maxWidth: '700px', margin: '0 auto 25px auto', fontSize: '16px' }}>
          Enter your journey, check the route distance and travel time, and see how your route choice affects the estimated rental cost.
        </p>

        {/* 5-Step Flow Diagram */}
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '15px', alignItems: 'center' }}>
          <div style={{ background: '#f1f5f9', padding: '10px 18px', borderRadius: '6px', fontWeight: 'bold', color: '#1e293b' }}>
            1. Enter Journey
          </div>
          <span style={{ color: '#2563eb', fontWeight: 'bold', fontSize: '18px' }}>&rarr;</span>
          <div style={{ background: '#f1f5f9', padding: '10px 18px', borderRadius: '6px', fontWeight: 'bold', color: '#1e293b' }}>
            2. Find Route
          </div>
          <span style={{ color: '#2563eb', fontWeight: 'bold', fontSize: '18px' }}>&rarr;</span>
          <div style={{ background: '#f1f5f9', padding: '10px 18px', borderRadius: '6px', fontWeight: 'bold', color: '#1e293b' }}>
            3. Choose Route
          </div>
          <span style={{ color: '#2563eb', fontWeight: 'bold', fontSize: '18px' }}>&rarr;</span>
          <div style={{ background: '#f1f5f9', padding: '10px 18px', borderRadius: '6px', fontWeight: 'bold', color: '#1e293b' }}>
            4. Check Price
          </div>
          <span style={{ color: '#2563eb', fontWeight: 'bold', fontSize: '18px' }}>&rarr;</span>
          <div style={{ background: '#dcfce7', padding: '10px 18px', borderRadius: '6px', fontWeight: 'bold', color: '#15803d' }}>
            5. Book
          </div>
        </div>
      </section>

      {/* Featured Cars Section */}
      <section>
        <h2 className="section-title">Featured Cars</h2>
        <div className="cars-grid">
          {featuredCars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
