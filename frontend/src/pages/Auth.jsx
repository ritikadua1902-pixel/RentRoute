import React, { useState } from 'react';

function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');


  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (isLogin) {
      
      if (!email || !password) {
        setError('Please fill in all required fields.');
        return;
      }
      setMessage('Login successful! Welcome back to RentRoute.');
    } else {
    
      if (!name || !email || !password || !confirmPassword) {
        setError('Please fill in all required fields.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      setMessage('Account created successfully! You can now log in.');
    }
  };

  const handleToggle = (loginState) => {
    setIsLogin(loginState);
    setMessage('');
    setError('');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#0f172a', fontSize: '24px' }}>
          {isLogin ? 'Welcome Back' : 'Create an Account'}
        </h2>

        <div className="auth-toggle">
          <button
            type="button"
            className={`auth-toggle-btn ${isLogin ? 'active' : ''}`}
            onClick={() => handleToggle(true)}
          >
            Login
          </button>
          <button
            type="button"
            className={`auth-toggle-btn ${!isLogin ? 'active' : ''}`}
            onClick={() => handleToggle(false)}
          >
            Sign Up
          </button>
        </div>

        {message && <div className="alert-success">{message}</div>}
        {error && <div className="alert-danger" style={{ marginTop: '0', marginBottom: '20px' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="auth-name">Full Name *</label>
              <input
                id="auth-name"
                type="text"
                className="form-control"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!isLogin}
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="auth-email">Email Address *</label>
            <input
              id="auth-email"
              type="email"
              className="form-control"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="auth-password">Password *</label>
            <input
              id="auth-password"
              type="password"
              className="form-control"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label htmlFor="auth-confirm-password">Confirm Password *</label>
              <input
                id="auth-confirm-password"
                type="password"
                className="form-control"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required={!isLogin}
              />
            </div>
          )}

          <button
            type="submit"
            className="btn"
            style={{ width: '100%', padding: '12px', fontSize: '16px', marginTop: '10px' }}
          >
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Auth;
