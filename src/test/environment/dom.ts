// DOM environment setup
export function setupDomEnvironment() {
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
}