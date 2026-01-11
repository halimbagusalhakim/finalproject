import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './ApiKeyPage.css';

function ApiKeyPage() {
  const [apiKey, setApiKey] = useState('');
  const [hasExpiredKey, setHasExpiredKey] = useState(false);
  const [expiresAt, setExpiresAt] = useState(null);
  const [testKey, setTestKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [testResult, setTestResult] = useState('');
  const [parsedData, setParsedData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchApiKey();
  }, [navigate]);

  const fetchApiKey = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:3001/api-keys/status', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        if (data.hasValidKey) {
          setApiKey(data.key);
          setHasExpiredKey(false);
          setExpiresAt(data.expiresAt);
        } else {
          setApiKey('');
          setHasExpiredKey(data.hasExpiredKey || false);
          setExpiresAt(null);
        }
      }
    } catch (error) {
      console.error('Error fetching API key:', error);
    }
  };

  const generateApiKey = async () => {
    const token = localStorage.getItem('token');
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api-keys/generate', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to generate API key');
      const result = await response.json();
      setApiKey(result.key);
      setHasExpiredKey(false);
      setExpiresAt(result.expiresAt);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const testPastedKey = async () => {
    if (!testKey) {
      setTestResult('Please enter an API key');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/data', {
        headers: { 'X-API-Key': testKey }
      });
      if (response.ok) {
        const data = await response.json();
        setParsedData(data);
        setTestResult('');
      } else {
        setTestResult(`API key is invalid: ${response.status}`);
        setParsedData(null);
      }
    } catch (error) {
      setTestResult(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="apikey-page">
      <nav className="dashboard-nav">
        <div className="nav-container">
          <Link to="/" className="nav-logo">MotoGP<span>Developer</span></Link>
          <button onClick={logout} className="logout-btn-minimal">Logout</button>
        </div>
      </nav>

      <main className="dashboard-content">
        <header className="content-header">
          <h1>Developer Dashboard</h1>
          <p>Manage your access keys and test API endpoints.</p>
        </header>

        <div className="grid-layout">
          {/* Key Generation Card */}
          <section className="dashboard-card key-card">
            <div className="card-header">
              <span className="icon">🔑</span>
              <h3>Authentication</h3>
            </div>
            <p>Generate a secure X-API-Key to authenticate your requests.</p>
            
            {!apiKey ? (
              <div className="key-status-message">
                <p>{hasExpiredKey ? 'API key sudah expired. Generate lagi.' : 'You don\'t have an API key yet.'}</p>
                <button onClick={generateApiKey} disabled={loading} className="btn-primary">
                  {loading ? 'Generating...' : 'Generate New Key'}
                </button>
              </div>
            ) : (
              <div className="key-box-reveal">
                <label>Active API Key</label>
                <div className="input-group">
                  <input type="text" value={apiKey} readOnly />
                  <button className="btn-copy" onClick={() => navigator.clipboard.writeText(apiKey)}>
                    Copy
                  </button>
                </div>
                <div className="key-info">
                  <span className="status-tag">● Active</span>
                  {expiresAt && (
                    <span className="expiry-info">
                      Expires: {new Date(expiresAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            )}
          </section>

          {/* Test Section */}
          <section className="dashboard-card test-card">
            <div className="card-header">
              <span className="icon">🧪</span>
              <h3>API Playground</h3>
            </div>
            <p>Paste your key below to fetch live MotoGP data.</p>
            <div className="test-input-group">
              <input
                type="text"
                placeholder="Paste X-API-Key here..."
                value={testKey}
                onChange={(e) => setTestKey(e.target.value)}
              />
              <button onClick={testPastedKey} disabled={loading} className="btn-secondary">
                {loading ? 'Fetching...' : 'Test Request'}
              </button>
            </div>
          </section>
        </div>

        {/* Results Area */}
        {parsedData && (
          <div className="results-area fade-in">
            <div className="results-header">
              <h3><span className="live-dot"></span> Response Data</h3>
            </div>
            
            <div className="data-section">
              <h4>🏁 Top Riders</h4>
              <div className="riders-grid">
                {parsedData.riders.map((rider, index) => (
                  <div key={index} className="rider-item">
                    <div className="rider-info">
                      <span className="rider-name">{rider.name}</span>
                      <span className="rider-team">{rider.team}</span>
                    </div>
                    <div className="rider-meta">
                      <span>{rider.nationality}</span>
                      <span>{new Date(rider.birthdate).getFullYear()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="data-section">
              <h4>🏎️ Teams</h4>
              <div className="teams-list">
                {parsedData.teams.map((team, index) => (
                  <div key={index} className="team-badge">
                    {team.name} <small>{team.country}</small>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {testResult && <div className="error-display">{testResult}</div>}
      </main>
    </div>
  );
}

export default ApiKeyPage;