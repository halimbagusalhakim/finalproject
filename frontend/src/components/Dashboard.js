import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
        fetch('https://localhost:3001/admin/users', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('https://localhost:3001/admin/api-keys', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('https://localhost:3001/admin/logs', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      if (usersRes.ok) setUsers(await usersRes.json());
      if (keysRes.ok) setApiKeys(await keysRes.json());
      if (logsRes.ok) setLogs(await logsRes.json());
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const toggleApiKey = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await fetch(`https://localhost:3001/admin/api-keys/${id}/toggle`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (error) {
      console.error('Error toggling API key:', error);
    }
  };

  const deleteApiKey = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await fetch(`https://localhost:3001/admin/api-keys/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (error) {
      console.error('Error deleting API key:', error);
    }
  };

  const deleteUser = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await fetch(`https://localhost:3001/admin/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const deleteLog = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await fetch(`https://localhost:3001/admin/logs/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (error) {
      console.error('Error deleting log:', error);
    }
  };

  const openAddUserModal = () => {
    setIsEdit(false);
    setFormData({ username: '', email: '', password: '', role: 'user' });
    setShowModal(true);
  };

  const openEditUserModal = (user) => {
    setIsEdit(true);
    setCurrentUser(user);
    setFormData({ username: user.username, email: user.email, password: '', role: user.role });
    setShowModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      if (isEdit) {
        await fetch(`https://localhost:3001/admin/users/${currentUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ username: formData.username, email: formData.email, role: formData.role })
        });
      } else {
        await fetch('https://localhost:3001/admin/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(formData)
        });
      }
      setShowModal(false);
      fetchData();
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <button onClick={logout} className="logout-btn">Logout</button>
      </header>
      <nav className="dashboard-nav">
        <button
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        <button
          className={activeTab === 'apikeys' ? 'active' : ''}
          onClick={() => setActiveTab('apikeys')}
        >
          API Keys
        </button>
        <button
          className={activeTab === 'logs' ? 'active' : ''}
          onClick={() => setActiveTab('logs')}
        >
          Logs
        </button>
      </nav>
      <main className="dashboard-content">
        {activeTab === 'users' && (
          <div>
            <h2>Users</h2>
            <button onClick={openAddUserModal}>Add User</button>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>API Key</th>
                  <th>Key Active</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>{user.Apikeys && user.Apikeys.length > 0 ? user.Apikeys[0].key : 'None'}</td>
                    <td>{user.Apikeys && user.Apikeys.length > 0 ? (user.Apikeys[0].isActive ? 'Yes' : 'No') : 'N/A'}</td>
                    <td>
                      <button onClick={() => openEditUserModal(user)}>Edit</button>
                      <button onClick={() => deleteUser(user.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {activeTab === 'apikeys' && (
          <div>
            <h2>API Keys</h2>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User ID</th>
                  <th>Key</th>
                  <th>Active</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {apiKeys.map(key => (
                  <tr key={key.id}>
                    <td>{key.id}</td>
                    <td>{key.userId}</td>
                    <td>{key.key}</td>
                    <td>{key.isActive ? 'Yes' : 'No'}</td>
                    <td>
                      <button onClick={() => toggleApiKey(key.id)}>
                        {key.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button onClick={() => deleteApiKey(key.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {activeTab === 'logs' && (
          <div>
            <h2>Request Logs</h2>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User ID</th>
                  <th>Endpoint</th>
                  <th>Method</th>
                  <th>Timestamp</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {logs.map(log => (
                  <tr key={log.id}>
                    <td>{log.id}</td>
                    <td>{log.userId}</td>
                    <td>{log.endpoint}</td>
                    <td>{log.method}</td>
                    <td>{new Date(log.createdAt).toLocaleString()}</td>
                    <td>
                      <button onClick={() => deleteLog(log.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>{isEdit ? 'Edit User' : 'Add User'}</h3>
            <form onSubmit={handleFormSubmit}>
              <input
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              {!isEdit && (
                <input
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              )}
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <button type="submit">{isEdit ? 'Update' : 'Create'}</button>
              <button type="button" onClick={closeModal}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;