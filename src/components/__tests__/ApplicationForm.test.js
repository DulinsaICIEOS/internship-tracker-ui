import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ApplicationForm from '../ApplicationForm';
import { ApplicationContext } from '../../context/ApplicationContext';

const mockAddApplication = jest.fn();
const mockUpdateApplication = jest.fn();

const mockContextValue = {
  addApplication: mockAddApplication,
  updateApplication: mockUpdateApplication,
};

describe('ApplicationForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders all form fields for new application', () => {
    render(
      <ApplicationContext.Provider value={mockContextValue}>
        <ApplicationForm />
      </ApplicationContext.Provider>
    );

    expect(screen.getByLabelText(/Company Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Job Role/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Applied Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Status/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Priority/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Interview Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Follow-up Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Job URL/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Notes/i)).toBeInTheDocument();
  });

  test('submits form with correct data for new application', async () => {
    mockAddApplication.mockResolvedValueOnce({});

    render(
      <ApplicationContext.Provider value={mockContextValue}>
        <ApplicationForm />
      </ApplicationContext.Provider>
    );

    fireEvent.change(screen.getByLabelText(/Company Name/i), {
      target: { value: 'Google' },
    });
    fireEvent.change(screen.getByLabelText(/Job Role/i), {
      target: { value: 'Software Engineer' },
    });
    fireEvent.change(screen.getByLabelText(/Applied Date/i), {
      target: { value: '2025-01-15' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Add Application/i }));

    await waitFor(() => {
      expect(mockAddApplication).toHaveBeenCalledWith(
        expect.objectContaining({
          companyName: 'Google',
          role: 'Software Engineer',
          appliedDate: '2025-01-15',
        })
      );
    });
  });

  test('pre-fills form when editing existing application', () => {
    const existingApp = {
      _id: '123',
      companyName: 'Microsoft',
      role: 'Product Manager',
      appliedDate: '2025-01-10',
      status: 'Interview',
      priority: 'High',
    };

    render(
      <ApplicationContext.Provider value={mockContextValue}>
        <ApplicationForm currentApplication={existingApp} />
      </ApplicationContext.Provider>
    );

    expect(screen.getByLabelText(/Company Name/i)).toHaveValue('Microsoft');
    expect(screen.getByLabelText(/Job Role/i)).toHaveValue('Product Manager');
    expect(screen.getByLabelText(/Applied Date/i)).toHaveValue('2025-01-10');
  });

  test('calls updateApplication when editing', async () => {
    mockUpdateApplication.mockResolvedValueOnce({});

    const existingApp = {
      _id: '123',
      companyName: 'Microsoft',
      role: 'Product Manager',
    };

    render(
      <ApplicationContext.Provider value={mockContextValue}>
        <ApplicationForm currentApplication={existingApp} />
      </ApplicationContext.Provider>
    );

    fireEvent.change(screen.getByLabelText(/Company Name/i), {
      target: { value: 'Amazon' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Update Application/i }));

    await waitFor(() => {
      expect(mockUpdateApplication).toHaveBeenCalledWith(
        '123',
        expect.objectContaining({
          companyName: 'Amazon',
        })
      );
    });
  });

  test('validates required fields', async () => {
    render(
      <ApplicationContext.Provider value={mockContextValue}>
        <ApplicationForm />
      </ApplicationContext.Provider>
    );

    fireEvent.click(screen.getByRole('button', { name: /Add Application/i }));

    await waitFor(() => {
      expect(mockAddApplication).not.toHaveBeenCalled();
    });
  });
});
