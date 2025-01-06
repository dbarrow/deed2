import { describe, it, expect, beforeEach } from 'vitest';
import { mapService } from '../MapService';
import { MAP_DEFAULTS } from '../../config/mapDefaults';
import L from '../../../../test/mocks/leaflet';

describe('MapService', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    jest.clearAllMocks();
  });

  describe('initialize', () => {
    it('should create new map with correct options', () => {
      mapService.initialize(container);

      expect(L.map).toHaveBeenCalledWith(container, {
        crs: L.CRS.Simple,
        minZoom: MAP_DEFAULTS.zoom.min,
        maxZoom: MAP_DEFAULTS.zoom.max,
        zoomControl: false,
        attributionControl: false
      });
    });

    it('should clean up existing map before creating new one', () => {
      mapService.initialize(container);
      const map = (mapService as any).map;
      const offSpy = jest.spyOn(map, 'off');
      const removeSpy = jest.spyOn(map, 'remove');
      
      mapService.initialize(container);
      
      expect(offSpy).toHaveBeenCalled();
      expect(removeSpy).toHaveBeenCalled();
    });

    it('should initialize layer groups', () => {
      mapService.initialize(container);
      expect(L.layerGroup).toHaveBeenCalledTimes(3);
    });
  });

  describe('clearLayers', () => {
    it('should clear all layer groups', () => {
      mapService.initialize(container);
      const layers = (mapService as any).layers;
      const clearSpy = jest.spyOn(layers.lines, 'clearLayers');
      
      mapService.clearLayers();
      expect(clearSpy).toHaveBeenCalled();
    });

    it('should do nothing if layers not initialized', () => {
      const clearSpy = jest.spyOn(L.layerGroup(), 'clearLayers');
      mapService.clearLayers();
      expect(clearSpy).not.toHaveBeenCalled();
    });
  });

  describe('addPoint', () => {
    it('should add point with default style', () => {
      mapService.initialize(container);
      mapService.addPoint({ x: 0, y: 0 });

      expect(L.circleMarker).toHaveBeenCalledWith([0, 0], {
        radius: MAP_DEFAULTS.style.point.size * 2,
        color: MAP_DEFAULTS.style.point.color,
        weight: MAP_DEFAULTS.style.point.weight,
        opacity: MAP_DEFAULTS.style.point.opacity,
        fillColor: MAP_DEFAULTS.style.point.color,
        fillOpacity: MAP_DEFAULTS.style.point.opacity
      });
    });

    it('should add point with custom style', () => {
      const customStyle = {
        color: '#ff0000',
        weight: 3,
        opacity: 0.5,
        size: 2
      };

      mapService.initialize(container);
      mapService.addPoint({ x: 0, y: 0 }, customStyle);

      expect(L.circleMarker).toHaveBeenCalledWith([0, 0], {
        radius: customStyle.size * 2,
        color: customStyle.color,
        weight: customStyle.weight,
        opacity: customStyle.opacity,
        fillColor: customStyle.color,
        fillOpacity: customStyle.opacity
      });
    });
  });
});