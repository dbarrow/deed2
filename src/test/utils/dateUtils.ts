import { vi } from 'vitest';

export class MockDate extends Date {
  constructor(dateString?: string | number | Date) {
    super(dateString || '2025-01-01T00:00:00Z');
  }
}

export function setupDateMock() {
  const RealDate = Date;
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2025-01-01T00:00:00Z'));
  
  // Replace global Date
  global.Date = MockDate as DateConstructor;
  
  return () => {
    global.Date = RealDate;
    vi.useRealTimers();
  };
}