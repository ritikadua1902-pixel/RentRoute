import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    if (!email || !password) {
      setError('Please fill in all required fields.');
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/logindata", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await response.json();
      if (data.error) {
        setError(data.error);
        return;
      }
      localStorage.setItem("user", JSON.stringify(data.user));
      setMessage('Login successful! Welcome back to RentRoute.');
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
        <h2 style={{textAlign:'center',marginBottom:'20px',color:'#0f172a',fontSize:'24px'}}> Welcome Back </h2>
        <div className="auth-toggle">
          <button type="button" className="auth-toggle-btn active" onClick={()=>navigate('/login')}>
            Login</button>
          <button type="button" className="auth-toggle-btn" onClick={()=>navigate('/signup')}>Sign Up</button>
        </div>

        {message && (
          <div className="alert-success">{message}</div>
        )}

        {error && (
          <div className="alert-danger" style={{marginTop: '0',marginBottom: '20px'}}>{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="auth-email">Email Address *</label>
            <input id="auth-email" type="email" className="form-control" placeholder="Enter your Email" value={email} onChange={(e) => setEmail(e.target.value)}required />
          </div>

          <div className="form-group">
            <label htmlFor="auth-password">Password *</label>
            <input id="auth-password" type="password" className="form-control"  placeholder="Enter your Password" value={password}onChange={(e) => setPassword(e.target.value)}required/>
          </div>

          <button type="submit" className="btn"
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '16px',
              marginTop: '10px'
            }}>Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;