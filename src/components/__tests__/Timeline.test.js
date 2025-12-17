import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Timeline from '../Timeline';

describe('Timeline Component', () => {
  const mockStatusHistory = [
    {
      status: 'Applied',
      date: '2025-01-10T10:00:00.000Z',
      note: 'Application submitted',
    },
    {
      status: 'Interview',
      date: '2025-01-15T14:30:00.000Z',
      note: 'Phone screening scheduled',
    },
    {
      status: 'Offer',
      date: '2025-01-20T16:00:00.000Z',
      note: 'Received job offer',
    },
  ];

  test('renders timeline with all status events', () => {
    render(<Timeline statusHistory={mockStatusHistory} />);

    expect(screen.getByText('Applied')).toBeInTheDocument();
    expect(screen.getByText('Interview')).toBeInTheDocument();
    expect(screen.getByText('Offer')).toBeInTheDocument();
  });

  test('displays notes for each timeline event', () => {
    render(<Timeline statusHistory={mockStatusHistory} />);

    expect(screen.getByText('Application submitted')).toBeInTheDocument();
    expect(screen.getByText('Phone screening scheduled')).toBeInTheDocument();
    expect(screen.getByText('Received job offer')).toBeInTheDocument();
  });

  test('displays empty state when statusHistory is empty', () => {
    render(<Timeline statusHistory={[]} />);

    expect(screen.getByText(/No status history available/i)).toBeInTheDocument();
  });

  test('displays empty state when statusHistory is null', () => {
    render(<Timeline statusHistory={null} />);

    expect(screen.getByText(/No status history available/i)).toBeInTheDocument();
  });

  test('displays timeline title', () => {
    render(<Timeline statusHistory={mockStatusHistory} />);

    expect(screen.getByText('Application Timeline')).toBeInTheDocument();
  });

  test('renders correct number of timeline items', () => {
    const { container } = render(<Timeline statusHistory={mockStatusHistory} />);

    const timelineItems = container.querySelectorAll('.timeline-item');
    expect(timelineItems).toHaveLength(3);
  });
});
