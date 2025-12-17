import React from 'react';
import { format } from 'date-fns';
import './Timeline.css';

const Timeline = ({ statusHistory }) => {
  if (!statusHistory || statusHistory.length === 0) {
    return (
      <div className="timeline-empty">
        <p>No status history available</p>
      </div>
    );
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Applied':
        return '📝';
      case 'Interview':
        return '💼';
      case 'Rejected':
        return '❌';
      case 'Offer':
        return '🎉';
      default:
        return '📌';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Applied':
        return 'timeline-applied';
      case 'Interview':
        return 'timeline-interview';
      case 'Rejected':
        return 'timeline-rejected';
      case 'Offer':
        return 'timeline-offer';
      default:
        return 'timeline-default';
    }
  };

  return (
    <div className="timeline-container">
      <h3 className="timeline-title">Application Timeline</h3>
      <div className="timeline">
        {statusHistory.map((event, index) => (
          <div key={index} className={`timeline-item ${getStatusColor(event.status)}`}>
            <div className="timeline-marker">
              <span className="timeline-icon">{getStatusIcon(event.status)}</span>
            </div>
            <div className="timeline-content">
              <div className="timeline-header">
                <h4>{event.status}</h4>
                <span className="timeline-date">
                  {format(new Date(event.date), 'MMM dd, yyyy - HH:mm')}
                </span>
              </div>
              {event.note && <p className="timeline-note">{event.note}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
