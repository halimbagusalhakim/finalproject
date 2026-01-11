import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config';
import './Register.css';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        })
      });

      if (!response.ok) throw new Error('Registration failed. Try another email.');

      setShowSuccessModal(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="bg-glow-register"></div>
      
      <div className="register-card">
        <div className="register-header">
          <Link to="/" className="back-link">← Back to Home</Link>
          <h2>Join the <span className="red-text">Paddock</span></h2>
          <p>Create your developer account to access MotoGP API.</p>
        </div>

        {error && <div className="error-message">⚠️ {error}</div>}

        <form onSubmit={handleSubmit} className="register-form-grid">
          <div className="form-group-custom">
            <label>Username</label>
            <input
              type="text"
              name="username"
              placeholder="RacerID"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group-custom">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="rider@gpworld.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group-custom">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group-custom">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="register-btn" disabled={loading}>
            {loading ? <span className="loader-mini"></span> : 'Create Account'}
          </button>
        </form>

        <div className="register-footer">
          <p>Member already? <Link to="/login">Sign In</Link></p>
        </div>
      </div>

      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="modal-box success-modal">
            <div className="success-icon">✅</div>
            <h3>Registration Successful!</h3>
            <p>Welcome to the paddock! Your account has been created.</p>
            <button onClick={() => navigate('/login')} className="btn-save">Go to Login</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Register;