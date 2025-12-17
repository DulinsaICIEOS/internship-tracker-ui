import React, { useState, useContext } from 'react';
import { ApplicationContext } from '../context/ApplicationContext';
import './ApplicationForm.css';

const ApplicationForm = ({ onClose, editApplication = null }) => {
  const [formData, setFormData] = useState({
    companyName: editApplication?.companyName || '',
    role: editApplication?.role || '',
    appliedDate: editApplication?.appliedDate 
      ? new Date(editApplication.appliedDate).toISOString().split('T')[0] 
      : new Date().toISOString().split('T')[0],
    status: editApplication?.status || 'Applied',
    notes: editApplication?.notes || '',
    jobUrl: editApplication?.jobUrl || '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { addApplication, updateApplication } = useContext(ApplicationContext);

  const { companyName, role, appliedDate, status, notes, jobUrl } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (editApplication) {
        await updateApplication(editApplication._id, formData);
      } else {
        await addApplication(formData);
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{editApplication ? 'Edit Application' : 'Add New Application'}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={onSubmit} className="application-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="companyName">Company Name *</label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={companyName}
                onChange={onChange}
                placeholder="e.g., Google, Microsoft"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="role">Role *</label>
              <input
                type="text"
                id="role"
                name="role"
                value={role}
                onChange={onChange}
                placeholder="e.g., Software Engineer Intern"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="appliedDate">Applied Date *</label>
              <input
                type="date"
                id="appliedDate"
                name="appliedDate"
                value={appliedDate}
                onChange={onChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="status">Status *</label>
              <select
                id="status"
                name="status"
                value={status}
                onChange={onChange}
                required
              >
                <option value="Applied">Applied</option>
                <option value="Interview">Interview</option>
                <option value="Rejected">Rejected</option>
                <option value="Offer">Offer</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="jobUrl">Job URL</label>
            <input
              type="url"
              id="jobUrl"
              name="jobUrl"
              value={jobUrl}
              onChange={onChange}
              placeholder="https://company.com/careers/job-id"
            />
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={notes}
              onChange={onChange}
              placeholder="Add any additional notes..."
              rows="4"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : editApplication ? 'Update' : 'Add Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationForm;
