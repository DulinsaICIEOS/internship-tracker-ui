import React, { useContext, useState } from 'react';
import { ApplicationContext } from '../context/ApplicationContext';
import { format } from 'date-fns';
import './ApplicationCard.css';

const ApplicationCard = ({ application, onEdit }) => {
  const { deleteApplication } = useContext(ApplicationContext);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    await deleteApplication(application._id);
    setShowConfirm(false);
  };

  const getStatusClass = (status) => {
    return `status-${status.toLowerCase()}`;
  };

  return (
    <div className="application-card">
      <div className="card-header">
        <div>
          <h3 className="company-name">{application.companyName}</h3>
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
