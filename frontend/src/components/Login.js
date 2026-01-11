import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error('Invalid email or password');

      const data = await response.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      data.user.role === 'admin' ? navigate('/dashboard') : navigate('/apikey');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Elemen Dekoratif Latar Belakang */}
      <div className="bg-glow"></div>
      
      <div className="login-card">
        <div className="login-header">
          <Link to="/" className="back-link">← Back to Home</Link>
          <h2>MotoGP <span className="red-text">Login</span></h2>
          <p>Enter your credentials to access the race data.</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form-content">
          <div className="form-input-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="error-box">
              <span>⚠️</span> {error}
            </div>
          )}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? <span className="loader"></span> : 'Sign In'}
          </button>
        </form>

        <div className="login-footer">
          <p>New to the paddock? <Link to="/register">Create Account</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Login;