import React, { createContext, useState, useContext, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

export const ApplicationContext = createContext();

export const ApplicationProvider = ({ children }) => {
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const { token } = useContext(AuthContext);

  const getAuthHeaders = () => ({
    headers: { 'x-auth-token': token }
  });

  const fetchApplications = useCallback(async (status = '') => {
    if (!token) return;
    
    setLoading(true);
    try {
      const query = status && status !== 'All' ? `?status=${status}` : '';
      const res = await axios.get(`/api/applications${query}`, getAuthHeaders());
      setApplications(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchStats = useCallback(async () => {
    if (!token) return;
    
    try {
      const res = await axios.get('/api/applications/stats/summary', getAuthHeaders());
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  }, [token]);

  const addApplication = async (applicationData) => {
    const res = await axios.post('/api/applications', applicationData, getAuthHeaders());
    setApplications([res.data, ...applications]);
    fetchStats();
    return res.data;
  };

  const updateApplication = async (id, applicationData) => {
    const res = await axios.put(`/api/applications/${id}`, applicationData, getAuthHeaders());
    setApplications(applications.map(app => app._id === id ? res.data : app));
    fetchStats();
    return res.data;
  };

  const deleteApplication = async (id) => {
    await axios.delete(`/api/applications/${id}`, getAuthHeaders());
    setApplications(applications.filter(app => app._id !== id));
    fetchStats();
  };

  return (
    <ApplicationContext.Provider value={{
      applications,
      stats,
      loading,
      fetchApplications,
      fetchStats,
      addApplication,
      updateApplication,
      deleteApplication
    }}>
      {children}
    </ApplicationContext.Provider>
  );
};
