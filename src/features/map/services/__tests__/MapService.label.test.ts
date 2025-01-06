import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mapService } from '../MapService';
import { MAP_DEFAULTS } from '../../config/mapDefaults';
import L from 'leaflet';

vi.mock('leaflet');

describe('MapService - Label Operations', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    vi.clearAllMocks();
    mapService.initialize(container);
  });

  describe('addLabel', () => {
    it('should add label with default style', () => {
      const position = { x: 50, y: 50 };
      const text = 'Test Label';
      
      mapService.addLabel(position, text);

      expect(L.divIcon).toHaveBeenCalledWith(expect.objectContaining({
        className: 'map-label',
        html: expect.stringContaining(text)
      }));
    });

    it('should add label with custom style', () => {
      const position = { x: 50, y: 50 };
      const text = 'Test Label';
      const customStyle = {
        color: '#ff0000',
        fontSize: 16,
        opacity: 0.8
      };

      mapService.addLabel(position, text, customStyle);

      expect(L.divIcon).toHaveBeenCalledWith(expect.objectContaining({
        className: 'map-label',
        html: expect.stringContaining(`color: ${customStyle.color}`)
      }));
    });
  });

  describe('updateLabelStyle', () => {
    it('should update style of existing labels', () => {
      const newStyle = {
        color: '#ff0000',
        fontSize: 16,
        opacity: 0.8
      };

      mapService.updateLabelStyle(newStyle);

      const layerGroup = L.layerGroup();
      expect(layerGroup.eachLayer).toHaveBeenCalled();
    });
  });
});