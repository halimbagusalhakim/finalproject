import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ApiKeyPage.css';

function ApiKeyPage() {
  const [apiKey, setApiKey] = useState('');
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
  }, [navigate]);

  const generateApiKey = async () => {
    const token = localStorage.getItem('token');
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api-keys/generate', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to generate API key');
      }

      const result = await response.json();
      setApiKey(result.key);
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
        headers: {
          'X-API-Key': testKey
        }
      });
      if (response.ok) {
        const data = await response.json();
        setParsedData(data);
        setTestResult(''); // Clear text result when showing cards
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
      <header className="page-header">
        <h1>API Key Management</h1>
        <button onClick={logout} className="logout-btn">Logout</button>
      </header>

      <div className="content">
        <section className="key-section">
          <h2>Generate API Key</h2>
          <p>Get your personal API key to access MotoGP data</p>
          <button onClick={generateApiKey} disabled={loading} className="generate-btn">
            {loading ? 'Generating...' : 'Generate API Key'}
          </button>
          {apiKey && (
            <div className="key-display">
              <label>Your API Key:</label>
              <input type="text" value={apiKey} readOnly />
              <button onClick={() => navigator.clipboard.writeText(apiKey)}>
                Copy
              </button>
            </div>
          )}
        </section>

        <section className="test-section">
          <h2>Test Copied API Key</h2>
          <p>Paste an API key to test if it's valid</p>
          <input
            type="text"
            placeholder="Paste your API key here"
            value={testKey}
            onChange={(e) => setTestKey(e.target.value)}
          />
          <button onClick={testPastedKey} disabled={loading}>
            Test Key
          </button>
          {parsedData ? (
            <div className="data-cards">
              <h3>Riders</h3>
              <div className="cards-container">
                {parsedData.riders.map((rider, index) => (
                  <div key={index} className="data-card">
                    <h4>{rider.name}</h4>
                    <p><strong>Nationality:</strong> {rider.nationality}</p>
                    <p><strong>Birthdate:</strong> {new Date(rider.birthdate).toLocaleDateString()}</p>
                    <p><strong>Team:</strong> {rider.team}</p>
                  </div>
                ))}
              </div>
              <h3>Teams</h3>
              <div className="cards-container">
                {parsedData.teams.map((team, index) => (
                  <div key={index} className="data-card">
                    <h4>{team.name}</h4>
                    <p><strong>Country:</strong> {team.country}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            testResult && <pre className="data-display">{testResult}</pre>
          )}
        </section>
      </div>
    </div>
  );
}

export default ApiKeyPage;
