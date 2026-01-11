import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
  return (
    <div className="landing-page">
      {/* Hero Section dengan Overlay */}
      <header className="hero">
        <div className="hero-content">
          <span className="badge">Official Data Partner</span>
          <h1>Experience The <span className="text-gradient">MotoGP</span> Speed</h1>
          <p>The ultimate destination for motorcycle racing data and real-time statistics.</p>
          <div className="hero-btns">
            <Link to="/login" className="cta-button">Access API Now</Link>
            <a href="#about" className="btn-outline">Learn More</a>
          </div>
        </div>
      </header>

      {/* Stats Section */}
      <section id="about" className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">🏁</div>
              <h3>20+</h3>
              <p>Global GP Tracks</p>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🏍️</div>
              <h3>25</h3>
              <p>Elite Riders</p>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⚡</div>
              <h3>350<small>km/h</small></h3>
              <p>Top Speed Record</p>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🏆</div>
              <h3>75+</h3>
              <p>Years of History</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features / API Section */}
      <section className="features">
        <div className="container">
          <div className="section-header">
            <h2>MotoGP Open API</h2>
            <p>Powerful endpoints to fuel your racing applications.</p>
          </div>
          <div className="feature-grid">
            <div className="feature-item">
              <div className="feature-status">Stable</div>
              <h3>Rider Analytics</h3>
              <p>Biometrics, career history, and live performance metrics from every circuit.</p>
            </div>
            <div className="feature-item">
              <div className="feature-status">Real-time</div>
              <h3>Team Insights</h3>
              <p>Comprehensive constructor data, technical specs, and team championship points.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="final-cta">
        <div className="cta-container">
          <h2>Ready to Start Racing?</h2>
          <p>Join thousands of developers worldwide using our racing engine.</p>
          <Link to="/login" className="cta-button secondary">Create Developer Account</Link>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;