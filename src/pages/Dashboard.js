import React, { useEffect, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ApplicationContext } from '../context/ApplicationContext';
import ApplicationForm from '../components/ApplicationForm';
import ApplicationCard from '../components/ApplicationCard';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const { applications, stats, loading, fetchApplications, fetchStats } = useContext(ApplicationContext);
  const [showForm, setShowForm] = useState(false);
  const [editApplication, setEditApplication] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    fetchApplications(filterStatus);
    fetchStats();
  }, [filterStatus, fetchApplications, fetchStats]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleAddClick = () => {
    setEditApplication(null);
    setShowForm(true);
  };

  const handleEditClick = (application) => {
    setEditApplication(application);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditApplication(null);
    fetchApplications(filterStatus);
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="container">
          <div className="header-content">
            <div className="header-left">
              <h1>🎯 Job Application Tracker</h1>
              <p>Welcome back, {user?.name}!</p>
            </div>
            <button onClick={handleLogout} className="btn btn-secondary">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="container">
        {/* Stats Dashboard */}
        <div className="stats-grid">
          <div className="stat-card stat-total">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <h3>Total Applications</h3>
              <p className="stat-value">{stats?.total || 0}</p>
            </div>
          </div>
          
          <div className="stat-card stat-applied">
            <div className="stat-icon">📝</div>
            <div className="stat-info">
              <h3>Applied</h3>
              <p className="stat-value">{stats?.applied || 0}</p>
            </div>
          </div>
          
          <div className="stat-card stat-interview">
            <div className="stat-icon">💼</div>
            <div className="stat-info">
              <h3>Interviews</h3>
              <p className="stat-value">{stats?.interview || 0}</p>
            </div>
          </div>
          
          <div className="stat-card stat-offer">
            <div className="stat-icon">🎉</div>
            <div className="stat-info">
              <h3>Offers</h3>
              <p className="stat-value">{stats?.offer || 0}</p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="controls">
          <div className="filter-section">
            <label htmlFor="statusFilter">Filter by Status:</label>
            <select
              id="statusFilter"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="All">All Applications</option>
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Rejected">Rejected</option>
              <option value="Offer">Offer</option>
            </select>
          </div>
          
          <button onClick={handleAddClick} className="btn btn-primary">
            ➕ Add Application
          </button>
        </div>

        {/* Applications List */}
        <div className="applications-section">
          <h2 className="section-title">
            {filterStatus === 'All' ? 'All Applications' : `${filterStatus} Applications`}
            <span className="count-badge">{applications.length}</span>
          </h2>

          {loading ? (
            <div className="loading">Loading applications...</div>
          ) : applications.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h3>No applications yet</h3>
              <p>Start tracking your job applications by clicking "Add Application"</p>
              <button onClick={handleAddClick} className="btn btn-primary">
                ➕ Add Your First Application
              </button>
            </div>
          ) : (
            <div className="applications-grid">
              {applications.map((application) => (
                <ApplicationCard
                  key={application._id}
                  application={application}
                  onEdit={handleEditClick}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Application Form Modal */}
      {showForm && (
        <ApplicationForm
          onClose={handleCloseForm}
          editApplication={editApplication}
        />
      )}
    </div>
  );
};

export default Dashboard;
