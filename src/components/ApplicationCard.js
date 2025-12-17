import React, { useContext, useState } from 'react';
import { ApplicationContext } from '../context/ApplicationContext';
import { format } from 'date-fns';
import Timeline from './Timeline';
import './ApplicationCard.css';

const ApplicationCard = ({ application, onEdit }) => {
  const { deleteApplication } = useContext(ApplicationContext);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);

  const handleDelete = async () => {
    await deleteApplication(application._id);
    setShowConfirm(false);
  };

  const getStatusClass = (status) => {
    return `status-${status.toLowerCase()}`;
  };

  const isUpcoming = (date) => {
    if (!date) return false;
    const deadline = new Date(date);
    const today = new Date();
    const diffDays = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 7;
  };

  return (
    <div className="application-card">
      <div className="card-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 className="company-name">{application.companyName}</h3>
            {application.priority === 'High' && <span className="priority-badge priority-high">🔥 High</span>}
          </div>
          <p className="role-name">{application.role}</p>
        </div>
        <span className={`status-badge ${getStatusClass(application.status)}`}>
          {application.status}
        </span>
      </div>

      <div className="card-body">
        <div className="card-info">
          <span className="info-label">Applied:</span>
          <span className="info-value">
            {format(new Date(application.appliedDate), 'MMM dd, yyyy')}
          </span>
        </div>

        {application.interviewDate && (
          <div className={`card-info ${isUpcoming(application.interviewDate) ? 'deadline-upcoming' : ''}`}>
            <span className="info-label">📅 Interview:</span>
            <span className="info-value">
              {format(new Date(application.interviewDate), 'MMM dd, yyyy')}
              {isUpcoming(application.interviewDate) && <span className="badge-upcoming">Upcoming!</span>}
            </span>
          </div>
        )}

        {application.followUpDate && (
          <div className={`card-info ${isUpcoming(application.followUpDate) ? 'deadline-upcoming' : ''}`}>
            <span className="info-label">🔔 Follow-up:</span>
            <span className="info-value">
              {format(new Date(application.followUpDate), 'MMM dd, yyyy')}
              {isUpcoming(application.followUpDate) && <span className="badge-upcoming">Due soon!</span>}
            </span>
          </div>
        )}

        {application.jobUrl && (
          <div className="card-info">
            <span className="info-label">Job URL:</span>
            <a 
              href={application.jobUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="job-link"
            >
              View Job
            </a>
          </div>
        )}

        {application.notes && (
          <div className="card-notes">
            <span className="info-label">Notes:</span>
            <p>{application.notes}</p>
          </div>
        )}

        {application.statusHistory && application.statusHistory.length > 1 && (
          <button 
            className="btn-timeline"
            onClick={() => setShowTimeline(!showTimeline)}
          >
            {showTimeline ? '▲ Hide Timeline' : '▼ View Timeline'}
          </button>
        )}

        {showTimeline && <Timeline statusHistory={application.statusHistory} />}
      </div>

      <div className="card-actions">
        <button onClick={() => onEdit(application)} className="btn-edit">
          ✏️ Edit
        </button>
        <button onClick={() => setShowConfirm(true)} className="btn-delete">
          🗑️ Delete
        </button>
      </div>

      {showConfirm && (
        <div className="confirm-overlay">
          <div className="confirm-dialog">
            <p>Are you sure you want to delete this application?</p>
            <div className="confirm-actions">
              <button onClick={() => setShowConfirm(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button onClick={handleDelete} className="btn btn-danger">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationCard;
