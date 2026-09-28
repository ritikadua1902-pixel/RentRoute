import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage('');
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/signupdata", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          email,
          password
        })
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
        return;
      }

      setMessage('Account created successfully!');

      localStorage.setItem("user", JSON.stringify({
        name: name,
        email: email
      }));

      setTimeout(() => {
        navigate('/');
      }, 500);

    } catch (err) {
      setError('Unable to connect to server.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2
          style={{
            textAlign: 'center',
            marginBottom: '20px',
            color: '#0f172a',
            fontSize: '24px'
          }}
        >
          Create an Account
        </h2>
        <div className="auth-toggle">
          <button
            type="button"
            className="auth-toggle-btn"
            onClick={() => navigate('/login')}
          >
            Login
          </button>
          <button
            type="button"
            className="auth-toggle-btn active"
          >
            Sign Up
          </button>
        </div>
        {message && (
          <div className="alert-success">
            {message}
          </div>
        )}
        {error && (
          <div
            className="alert-danger"
            style={{
              marginTop: '0',
              marginBottom: '20px'
            }}
          >
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="auth-name">Full Name *</label>
            <input
              id="auth-name"
              className="form-control"
              placeholder="Enter your Full Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="auth-email">Email Address *</label>
            <input
              id="auth-email"
              className="form-control"
              placeholder="Enter your Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="auth-password">Password *</label>
            <input
              id="auth-password"
              className="form-control"
              placeholder="Enter your Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="auth-confirm-password">Confirm Password *</label>
            <input
              id="auth-confirm-password"
              className="form-control"
              placeholder="Enter your Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="btn"
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '16px',
              marginTop: '10px'
            }}
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;