import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mapService } from '../MapService';
import { MAP_DEFAULTS } from '../../config/mapDefaults';
import L from 'leaflet';

vi.mock('leaflet');

describe('MapService - Line Operations', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    vi.clearAllMocks();
    mapService.initialize(container);
  });

  describe('addLine', () => {
    it('should add line with default style', () => {
      const start = { x: 0, y: 0 };
      const end = { x: 100, y: 100 };
      
      mapService.addLine(start, end);

      expect(L.polyline).toHaveBeenCalledWith(
        [[start.y, start.x], [end.y, end.x]],
        {
          color: MAP_DEFAULTS.style.line.color,
          weight: MAP_DEFAULTS.style.line.weight,
          opacity: MAP_DEFAULTS.style.line.opacity
        }
      );
    });

    it('should add line with custom style', () => {
      const start = { x: 0, y: 0 };
      const end = { x: 100, y: 100 };
      const customStyle = {
        color: '#ff0000',
        weight: 3,
        opacity: 0.5
      };

      mapService.addLine(start, end, customStyle);

      expect(L.polyline).toHaveBeenCalledWith(
        [[start.y, start.x], [end.y, end.x]],
        customStyle
      );
    });
  });

  describe('updateLineStyle', () => {
    it('should update style of existing lines', () => {
      const newStyle = {
        color: '#ff0000',
        weight: 3,
        opacity: 0.5
      };

      mapService.updateLineStyle(newStyle);

      const layerGroup = L.layerGroup();
      expect(layerGroup.eachLayer).toHaveBeenCalled();
    });
  });
});