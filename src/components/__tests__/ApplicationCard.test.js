import { isUpcoming } from '../ApplicationCard';

describe('isUpcoming utility function', () => {
  beforeEach(() => {
    // Mock current date to 2025-01-15
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-01-15'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('returns true for date within 7 days', () => {
    const futureDate = new Date('2025-01-20'); // 5 days from now
    expect(isUpcoming(futureDate)).toBe(true);
  });

  test('returns true for today', () => {
    const today = new Date('2025-01-15');
    expect(isUpcoming(today)).toBe(true);
  });

  test('returns false for date more than 7 days away', () => {
    const distantDate = new Date('2025-01-25'); // 10 days from now
    expect(isUpcoming(distantDate)).toBe(false);
  });

  test('returns false for past date', () => {
    const pastDate = new Date('2025-01-10'); // 5 days ago
    expect(isUpcoming(pastDate)).toBe(false);
  });

  test('returns false for null or undefined', () => {
    expect(isUpcoming(null)).toBe(false);
    expect(isUpcoming(undefined)).toBe(false);
  });

  test('returns true for exactly 7 days away', () => {
    const weekAway = new Date('2025-01-22'); // Exactly 7 days
    expect(isUpcoming(weekAway)).toBe(true);
  });
});
