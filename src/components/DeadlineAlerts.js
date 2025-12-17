import React, { useContext, useEffect, useState } from 'react';
import { ApplicationContext } from '../context/ApplicationContext';
import apiClient from '../utils/api';
import { format } from 'date-fns';
import './DeadlineAlerts.css';

const DeadlineAlerts = ({ token }) => {
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUpcomingDeadlines = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await apiClient.get('/api/applications/upcoming/deadlines');
        setUpcomingDeadlines(res.data);
      } catch (err) {
        console.error('Error fetching deadlines:', err);
        setError('Could not load upcoming deadlines. Please try again later.');
        
        // Optional: Send to error tracking service
        // if (window.Sentry) {
        //   window.Sentry.captureException(err);
        // }
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchUpcomingDeadlines();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="deadline-alerts">
        <div className="alert-loading">
          <span className="loading-spinner">⏳</span> Loading upcoming deadlines...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="deadline-alerts deadline-alerts-error">
        <div className="alert-error">
          <span>⚠️</span> {error}
        </div>
      </div>
    );
  }

  if (upcomingDeadlines.length === 0) {
    return null;
  }

  return (
    <div className="deadline-alerts">
      <div className="alert-header">
        <h3>⏰ Upcoming Deadlines</h3>
        <span className="alert-count">{upcomingDeadlines.length}</span>
      </div>
      
      <div className="alert-list">
        {upcomingDeadlines.map((app) => (
          <div key={app._id} className="alert-item">
            <div className="alert-company">
              <strong>{app.companyName}</strong>
              <span className="alert-role">{app.role}</span>
            </div>
            
            {app.interviewDate && (
              <div className="alert-deadline interview">
                📅 Interview: {format(new Date(app.interviewDate), 'MMM dd, yyyy')}
              </div>
            )}
            
            {app.followUpDate && (
              <div className="alert-deadline followup">
                🔔 Follow-up: {format(new Date(app.followUpDate), 'MMM dd, yyyy')}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeadlineAlerts;
