import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mapService } from '../MapService';
import L from 'leaflet';

vi.mock('leaflet');

describe('MapService - Error Handling', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    vi.clearAllMocks();
  });

  describe('initialization errors', () => {
    it('should handle null container', () => {
      expect(() => mapService.initialize(null as any))
        .toThrow('Map container is required');
    });

    it('should handle invalid container', () => {
      const invalidContainer = document.createElement('span');
      expect(() => mapService.initialize(invalidContainer))
        .toThrow('Invalid map container');
    });
  });

  describe('layer operation errors', () => {
    it('should handle operations before initialization', () => {
      expect(() => mapService.addPoint({ x: 0, y: 0 }))
        .toThrow('Map not initialized');
      
      expect(() => mapService.addLine({ x: 0, y: 0 }, { x: 100, y: 100 }))
        .toThrow('Map not initialized');
      
      expect(() => mapService.addLabel({ x: 0, y: 0 }, 'Test'))
        .toThrow('Map not initialized');
    });

    it('should handle invalid coordinates', () => {
      mapService.initialize(container);

      expect(() => mapService.addPoint({ x: NaN, y: 0 }))
        .toThrow('Invalid coordinates');
      
      expect(() => mapService.addLine(
        { x: 0, y: 0 },
        { x: Infinity, y: 100 }
      )).toThrow('Invalid coordinates');
    });

    it('should handle invalid styles', () => {
      mapService.initialize(container);

      expect(() => mapService.addPoint(
        { x: 0, y: 0 },
        { color: '', weight: -1 } as any
      )).toThrow('Invalid style configuration');
    });
  });

  describe('cleanup', () => {
    it('should handle cleanup of uninitialized map', () => {
      expect(() => mapService.cleanup()).not.toThrow();
    });

    it('should remove event listeners on cleanup', () => {
      const mockMap = {
        remove: vi.fn(),
        off: vi.fn()
      };
      (L.map as any).mockReturnValue(mockMap);

      mapService.initialize(container);
      mapService.cleanup();

      expect(mockMap.off).toHaveBeenCalled();
      expect(mockMap.remove).toHaveBeenCalled();
    });
  });
});