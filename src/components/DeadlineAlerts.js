import React, { useContext, useEffect, useState } from 'react';
import { ApplicationContext } from '../context/ApplicationContext';
import axios from 'axios';
import { format } from 'date-fns';
import './DeadlineAlerts.css';

const DeadlineAlerts = ({ token }) => {
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUpcomingDeadlines = async () => {
      try {
        const res = await axios.get('/api/applications/upcoming/deadlines', {
          headers: { 'x-auth-token': token }
        });
        setUpcomingDeadlines(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchUpcomingDeadlines();
    }
  }, [token]);

  if (loading || upcomingDeadlines.length === 0) {
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
