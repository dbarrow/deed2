import { describe, it, expect, beforeEach } from 'vitest';
import { initializeMap } from '../mapInitializer';
import { MockMap } from '../../../../test/mocks/leaflet';
import L from 'leaflet';

describe('mapInitializer', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  it('should create a map instance', () => {
    const map = initializeMap(container);
    expect(map).toBeInstanceOf(MockMap);
  });

  it('should set correct map options', () => {
    const map = initializeMap(container);
    expect(map.options.crs).toBe('Simple');
    expect(map.options.minZoom).toBe(-3);
    expect(map.options.maxZoom).toBe(3);
    expect(map.options.zoomControl).toBe(false);
    expect(map.options.attributionControl).toBe(false);
  });

  it('should clean up existing content', () => {
    container.innerHTML = '<div>Old content</div>';
    initializeMap(container);
    expect(container.innerHTML).toBe('');
  });
});