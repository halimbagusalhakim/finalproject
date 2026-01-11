import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
  const [users, setUsers] = useState([]);
  const [apiKeys, setApiKeys] = useState([]);
  const [logs, setLogs] = useState([]);
  const [activeTab, setActiveTab] = useState('users');
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({ username: '', email: '', password: '', role: 'user' });
  const [editKeyModal, setEditKeyModal] = useState(false);
  const [editingKey, setEditingKey] = useState(null);
  const [expirationDate, setExpirationDate] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    try {
      const [usersRes, keysRes, logsRes] = await Promise.all([
        fetch('http://localhost:3001/admin/users', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('http://localhost:3001/admin/api-keys', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('http://localhost:3001/admin/logs', { headers: { Authorization: `Bearer ${token}` } })
      ]);

      if (usersRes.ok) setUsers(await usersRes.json());
      if (keysRes.ok) setApiKeys(await keysRes.json());
      if (logsRes.ok) setLogs(await logsRes.json());
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // ... (Keep the toggle/delete functions as they were) ...
  const toggleApiKey = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await fetch(`http://localhost:3001/admin/api-keys/${id}/toggle`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (error) { console.error(error); }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    const token = localStorage.getItem('token');
    try {
      await fetch(`http://localhost:3001/admin/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (error) { console.error(error); }
  };

  const openEditKeyModal = (key) => {
    setEditingKey(key);
    setExpirationDate(key.expiresAt ? new Date(key.expiresAt).toISOString().split('T')[0] : '');
    setEditKeyModal(true);
  };

  const handleEditKeySubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await fetch(`http://localhost:3001/admin/api-keys/${editingKey.id}/expiration`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ expiresAt: expirationDate || null })
      });
      setEditKeyModal(false);
      fetchData();
    } catch (error) { console.error(error); }
  };

  const openAddUserModal = () => {
    setIsEdit(false);
    setFormData({ username: '', email: '', password: '', role: 'user' });
    setShowModal(true);
  };

  const openEditUserModal = (user) => {
    setIsEdit(true);
    setCurrentUser(user);
    setFormData({ username: user.username, email: user.email, role: user.role });
    setShowModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const url = isEdit ? `http://localhost:3001/admin/users/${currentUser.id}` : 'http://localhost:3001/admin/users';
    const method = isEdit ? 'PUT' : 'POST';
    
    try {
      await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData)
      });
      setShowModal(false);
      fetchData();
    } catch (error) { console.error(error); }
  };

  return (
    <div className="admin-dashboard">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <Link to="/" className="brand-text">MotoGP<span>Admin</span></Link>
        </div>
        <nav className="sidebar-nav">
          <button className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>
            <span>👥</span> Users
          </button>
          <button className={activeTab === 'apikeys' ? 'active' : ''} onClick={() => setActiveTab('apikeys')}>
            <span>🔑</span> API Keys
          </button>
          <button className={activeTab === 'logs' ? 'active' : ''} onClick={() => setActiveTab('logs')}>
            <span>📋</span> Activity Logs
          </button>
        </nav>
        <button onClick={() => { localStorage.clear(); navigate('/'); }} className="logout-sidebar">
          Logout
        </button>
      </aside>

      <main className="main-content">
        <header className="main-header">
          <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management</h2>
          {activeTab === 'users' && (
            <button onClick={openAddUserModal} className="btn-add">+ New User</button>
          )}
        </header>

        <div className="table-container fade-in">
          {activeTab === 'users' && (
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>API Key Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>
                      <div className="user-info">
                        <span className="u-name">{user.username}</span>
                        <span className="u-email">{user.email}</span>
                      </div>
                    </td>
                    <td><span className={`badge-role ${user.role}`}>{user.role}</span></td>
                    <td>
                      {user.Apikeys?.[0] ? (
                        <span className={`status-dot ${user.Apikeys[0].isActive ? 'active' : 'inactive'}`}>
                          {user.Apikeys[0].isActive ? 'Active' : 'Disabled'}
                        </span>
                      ) : 'None'}
                    </td>
                    <td className="actions-cell">
                      <button className="btn-edit" onClick={() => openEditUserModal(user)}>Edit</button>
                      <button className="btn-delete" onClick={() => deleteUser(user.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'apikeys' && (
             <table>
             <thead>
               <tr>
                 <th>Key</th>
                 <th>User</th>
                 <th>Status</th>
                 <th>Expires</th>
                 <th>Actions</th>
               </tr>
             </thead>
             <tbody>
               {apiKeys.map(key => {
                 const isExpired = key.expiresAt && new Date(key.expiresAt) < new Date();
                 let statusText, statusClass;
                 if (!key.isActive) {
                   statusText = 'Revoked';
                   statusClass = 'off';
                 } else if (isExpired) {
                   statusText = 'Expired';
                   statusClass = 'expired';
                 } else {
                   statusText = 'Active';
                   statusClass = 'on';
                 }
                 return (
                   <tr key={key.id}>
                     <td className="mono-text">{key.key.substring(0, 15)}...</td>
                     <td>{key.User?.username || `User #${key.userId}`}</td>
                     <td>
                       <span className={`status-pill ${statusClass}`}>
                         {statusText}
                       </span>
                     </td>
                     <td>
                       {key.expiresAt ? (
                         <span className={new Date(key.expiresAt) < new Date() ? 'expired-date' : 'active-date'}>
                           {new Date(key.expiresAt).toLocaleDateString()}
                         </span>
                       ) : 'Never'}
                     </td>
                     <td className="actions-cell">
                       <button onClick={() => openEditKeyModal(key)} className="btn-edit">
                         Edit
                       </button>
                       <button onClick={() => toggleApiKey(key.id)} className="btn-toggle">
                         {key.isActive ? 'Disable' : 'Enable'}
                       </button>
                     </td>
                   </tr>
                 );
               })}
             </tbody>
           </table>
          )}

          {activeTab === 'logs' && (
             <div className="log-list">
                {logs.map(log => (
                  <div className="log-item" key={log.id}>
                    <span className="log-method">{log.method}</span>
                    <span className="log-path">{log.endpoint}</span>
                    <span className="log-time">{new Date(log.createdAt).toLocaleString()}</span>
                    <span className="log-user">User ID: {log.userId}</span>
                  </div>
                ))}
             </div>
          )}
        </div>
      </main>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>{isEdit ? 'Update Racer Data' : 'Enlist New Racer'}</h3>
            <form onSubmit={handleFormSubmit}>
              <div className="form-field">
                <label>Username</label>
                <input type="text" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} required />
              </div>
              <div className="form-field">
                <label>Email</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
              </div>
              {!isEdit && (
                <div className="form-field">
                  <label>Password</label>
                  <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
                </div>
              )}
              <div className="form-field">
                <label>Role</label>
                <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn-save">Save Changes</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-cancel">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editKeyModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Edit API Key Expiration</h3>
            <form onSubmit={handleEditKeySubmit}>
              <div className="form-field">
                <label>API Key</label>
                <input type="text" value={editingKey?.key.substring(0, 20) + '...'} readOnly />
              </div>
              <div className="form-field">
                <label>Expiration Date</label>
                <input
                  type="date"
                  value={expirationDate}
                  onChange={(e) => setExpirationDate(e.target.value)}
                />
                <small style={{ color: '#888', fontSize: '0.8rem' }}>
                  Leave empty for no expiration
                </small>
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn-save">Update Expiration</button>
                <button type="button" onClick={() => setEditKeyModal(false)} className="btn-cancel">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;