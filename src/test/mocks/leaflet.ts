import { vi } from 'vitest';

export class MockMap {
  private options: any;
  private layers: any[] = [];
  private eventHandlers: Record<string, Function[]> = {};

  constructor(container: HTMLElement, options: any) {
    this.options = options;
  }

  setView() { return this; }
  getZoom() { return 0; }
  setZoom() { return this; }
  panTo() { return this; }
  fitBounds() { return this; }
  getBounds() { return { pad: () => this }; }
  addLayer(layer: any) { this.layers.push(layer); return this; }
  removeLayer(layer: any) { 
    const index = this.layers.indexOf(layer);
    if (index > -1) this.layers.splice(index, 1);
    return this;
  }
  hasLayer(layer: any) { return this.layers.includes(layer); }
  off(event?: string) { 
    if (event) {
      this.eventHandlers[event] = [];
    } else {
      this.eventHandlers = {};
    }
    return this; 
  }
  on(event: string, handler: Function) { 
    if (!this.eventHandlers[event]) {
      this.eventHandlers[event] = [];
    }
    this.eventHandlers[event].push(handler);
    return this; 
  }
  remove() { 
    this.layers = []; 
    this.eventHandlers = {};
    return this; 
  }
}

export class MockLayerGroup {
  private layers: any[] = [];

  addTo() { return this; }
  addLayer(layer: any) { this.layers.push(layer); return this; }
  removeLayer(layer: any) { 
    const index = this.layers.indexOf(layer);
    if (index > -1) this.layers.splice(index, 1);
  }
  clearLayers() { this.layers = []; }
  eachLayer(callback: (layer: any) => void) {
    this.layers.forEach(callback);
  }
  removeFrom() { return this; }
}

export class MockPolyline {
  private options: any;
  constructor(latlngs: any[], options: any) {
    this.options = options;
  }
  addTo() { return this; }
  setStyle(style: any) { this.options = { ...this.options, ...style }; }
}

export class MockCircleMarker {
  private options: any;
  constructor(latlng: any, options: any) {
    this.options = options;
  }
  addTo() { return this; }
  setStyle(style: any) { this.options = { ...this.options, ...style }; }
}

const L = {
  map: vi.fn((container, options) => new MockMap(container, options)),
  layerGroup: vi.fn(() => new MockLayerGroup()),
  circleMarker: vi.fn((latlng, options) => new MockCircleMarker(latlng, options)),
  polyline: vi.fn((latlngs, options) => new MockPolyline(latlngs, options)),
  marker: vi.fn(() => ({ addTo: vi.fn() })),
  divIcon: vi.fn(() => ({})),
  control: {
    zoom: vi.fn(() => ({
      addTo: vi.fn()
    }))
  },
  CRS: { Simple: 'Simple' },
  latLngBounds: vi.fn(() => ({
    pad: vi.fn(() => ({}))
  }))
};

export default {
  ...L,
  __esModule: true,
  default: L
};