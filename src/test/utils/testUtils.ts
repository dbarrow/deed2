import { vi } from 'vitest';

export function createMockDate() {
  const mockDate = new Date('2025-01-01T00:00:00Z');
  vi.useFakeTimers();
  vi.setSystemTime(mockDate);
  return mockDate;
}

export function advanceTime(ms: number) {
  vi.advanceTimersByTime(ms);
}

export function restoreDate() {
  vi.useRealTimers();
}