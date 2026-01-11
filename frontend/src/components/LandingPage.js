import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
  return (
    <div className="landing-page">
      <header className="hero">
        <h1>Welcome to MotoGP World</h1>
        <p>Experience the thrill of motorcycle racing</p>
      </header>

      <section className="about">
        <div className="container">
          <h2>About MotoGP</h2>
          <p>MotoGP is the premier class of motorcycle road racing. Since its inception in 1949, it has evolved into a global spectacle featuring the world's best riders competing on cutting-edge technology. The championship consists of 20+ races across 5 continents, showcasing speed, skill, and innovation.</p>
          <div className="stats">
            <div className="stat">
              <h3>20+</h3>
              <p>Races per season</p>
            </div>
            <div className="stat">
              <h3>25</h3>
              <p>Riders per race</p>
            </div>
            <div className="stat">
              <h3>350km/h</h3>
              <p>Top speeds</p>
            </div>
            <div className="stat">
              <h3>75+</h3>
              <p>Years of history</p>
            </div>
          </div>
        </div>
      </section>

      <section className="api-section">
        <div className="container">
          <h2>MotoGP Open API</h2>
          <p>Access comprehensive MotoGP data through our open API. Get real-time information about riders, teams, standings, and statistics to build your own MotoGP applications.</p>
          <div className="api-features">
            <div className="feature-card">
              <h3>Rider Profiles</h3>
              <p>Detailed information about MotoGP riders including their nationality, team, and performance stats</p>
            </div>
            <div className="feature-card">
              <h3>Team Data</h3>
              <p>Complete team information, history, and current season performance</p>
            </div>
          </div>
          <Link to="/login" className="cta-button">Access API</Link>
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <h2>Ready to Explore MotoGP Data?</h2>
          <p>Join our community of developers and racing enthusiasts. Create an account to access the MotoGP Open API and start building amazing applications.</p>
          <Link to="/login" className="cta-button secondary">Get Started</Link>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
