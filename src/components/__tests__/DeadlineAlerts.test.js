import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DeadlineAlerts from '../DeadlineAlerts';
import apiClient from '../../utils/api';

// Mock the API client
jest.mock('../../utils/api');

describe('DeadlineAlerts Component', () => {
  const mockToken = 'test-token-123';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('displays loading state initially', () => {
    apiClient.get.mockImplementation(() => new Promise(() => {})); // Never resolves
    
    render(<DeadlineAlerts token={mockToken} />);
    
    expect(screen.getByText(/Loading upcoming deadlines/i)).toBeInTheDocument();
  });

  test('displays deadline alerts when data is fetched successfully', async () => {
    const mockDeadlines = [
      {
        _id: '1',
        companyName: 'Google',
        role: 'Software Engineer',
        interviewDate: '2025-01-20',
      },
      {
        _id: '2',
        companyName: 'Microsoft',
        role: 'Product Manager',
        followUpDate: '2025-01-22',
      },
    ];

    apiClient.get.mockResolvedValueOnce({ data: mockDeadlines });

    render(<DeadlineAlerts token={mockToken} />);

    await waitFor(() => {
      expect(screen.getByText('Google')).toBeInTheDocument();
      expect(screen.getByText('Microsoft')).toBeInTheDocument();
    });
  });

  test('displays error message when API call fails', async () => {
    apiClient.get.mockRejectedValueOnce(new Error('Network error'));

    render(<DeadlineAlerts token={mockToken} />);

    await waitFor(() => {
      expect(screen.getByText(/Could not load upcoming deadlines/i)).toBeInTheDocument();
    });
  });

  test('renders nothing when there are no upcoming deadlines', async () => {
    apiClient.get.mockResolvedValueOnce({ data: [] });

    const { container } = render(<DeadlineAlerts token={mockToken} />);

    await waitFor(() => {
      expect(container.firstChild).toBeNull();
    });
  });

  test('calls API with correct endpoint', async () => {
    apiClient.get.mockResolvedValueOnce({ data: [] });

    render(<DeadlineAlerts token={mockToken} />);

    await waitFor(() => {
      expect(apiClient.get).toHaveBeenCalledWith('/api/applications/upcoming/deadlines');
    });
  });
});
