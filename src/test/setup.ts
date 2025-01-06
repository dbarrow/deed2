import { vi } from 'vitest';
import { config } from '@vue/test-utils';
import L from './mocks/leaflet';
import { setupDateMock } from './utils/dateUtils';

// Mock window.crypto
Object.defineProperty(window, 'crypto', {
  value: { randomUUID: () => 'test-uuid' }
});

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock requestAnimationFrame
global.requestAnimationFrame = vi.fn(cb => setTimeout(cb, 0));
global.cancelAnimationFrame = vi.fn(id => clearTimeout(id));

// Configure Vue Test Utils
config.global.stubs = {
  transition: false,
  'transition-group': false
};

// Mock Leaflet
vi.mock('leaflet', () => L);

// Mock Vue lifecycle hooks and utilities
vi.mock('vue', async () => {
  const actual = await vi.importActual('vue');
  return {
    ...actual as any,
    onMounted: vi.fn((fn: () => void) => fn()),
    onUnmounted: vi.fn((fn: () => void) => fn()),
    nextTick: () => Promise.resolve(),
    watch: vi.fn((source, cb) => {
      if (typeof source === 'function') {
        cb(source());
      } else if (Array.isArray(source)) {
        source.forEach(s => s && s.value && cb(s.value));
      } else if (source && source.value) {
        cb(source.value);
      }
      return () => {};
    })
  };
});

// Setup date mock
const cleanupDateMock = setupDateMock();

// Cleanup after tests
afterAll(() => {
  cleanupDateMock();
});