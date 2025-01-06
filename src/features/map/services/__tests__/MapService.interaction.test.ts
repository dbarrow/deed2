import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mapService } from '../MapService';
import { MAP_DEFAULTS } from '../../config/mapDefaults';
import L from 'leaflet';

vi.mock('leaflet');

describe('MapService - Map Interactions', () => {
  let container: HTMLElement;
  let mockMap: any;

  beforeEach(() => {
    container = document.createElement('div');
    mockMap = {
      on: vi.fn(),
      off: vi.fn(),
      setZoom: vi.fn(),
      getZoom: vi.fn().mockReturnValue(0),
      panTo: vi.fn(),
      fitBounds: vi.fn(),
      getBounds: vi.fn()
    };
    
    (L.map as any).mockReturnValue(mockMap);
    vi.clearAllMocks();
    mapService.initialize(container);
  });

  describe('zoom operations', () => {
    it('should handle zoom in', () => {
      mapService.zoomIn();
      expect(mockMap.setZoom).toHaveBeenCalledWith(1);
    });

    it('should handle zoom out', () => {
      mapService.zoomOut();
      expect(mockMap.setZoom).toHaveBeenCalledWith(-1);
    });

    it('should respect zoom limits', () => {
      mockMap.getZoom.mockReturnValue(MAP_DEFAULTS.zoom.max);
      mapService.zoomIn();
      expect(mockMap.setZoom).not.toHaveBeenCalled();

      mockMap.getZoom.mockReturnValue(MAP_DEFAULTS.zoom.min);
      mapService.zoomOut();
      expect(mockMap.setZoom).not.toHaveBeenCalled();
    });
  });

  describe('pan operations', () => {
    it('should pan to point', () => {
      const point = { x: 100, y: 100 };
      mapService.panTo(point);
      expect(mockMap.panTo).toHaveBeenCalledWith([point.y, point.x]);
    });

    it('should handle smooth panning', () => {
      const point = { x: 100, y: 100 };
      mapService.panTo(point, { animate: true, duration: 1 });
      expect(mockMap.panTo).toHaveBeenCalledWith(
        [point.y, point.x],
        { animate: true, duration: 1 }
      );
    });
  });

  describe('bounds operations', () => {
    it('should fit bounds to points', () => {
      const points = [
        { x: 0, y: 0 },
        { x: 100, y: 100 }
      ];
      
      mapService.fitBounds(points);
      expect(mockMap.fitBounds).toHaveBeenCalled();
    });

    it('should handle empty points array', () => {
      mapService.fitBounds([]);
      expect(mockMap.fitBounds).not.toHaveBeenCalled();
    });

    it('should apply padding to bounds', () => {
      const points = [
        { x: 0, y: 0 },
        { x: 100, y: 100 }
      ];
      
      mapService.fitBounds(points, { padding: 50 });
      expect(mockMap.fitBounds).toHaveBeenCalledWith(
        expect.any(Object),
        { padding: [50, 50] }
      );
    });
  });
});