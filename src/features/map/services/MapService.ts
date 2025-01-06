import L from 'leaflet';
import type { Point } from '../../../types';
import { MAP_DEFAULTS } from '../config/mapDefaults';

export class MapService {
  private map: L.Map | null = null;
  private layers: {
    lines: L.LayerGroup;
    points: L.LayerGroup;
    labels: L.LayerGroup;
  } | null = null;

  initialize(container: HTMLElement): void {
    if (!container) {
      throw new Error('Map container is required');
    }

    if (!(container instanceof HTMLDivElement)) {
      throw new Error('Invalid map container');
    }

    // Clean up existing map
    if (this.map) {
      this.cleanup();
    }

    container.innerHTML = '';

    this.map = L.map(container, {
      crs: L.CRS.Simple,
      minZoom: MAP_DEFAULTS.zoom.min,
      maxZoom: MAP_DEFAULTS.zoom.max,
      zoomControl: false,
      attributionControl: false
    });

    L.control.zoom({
      position: 'topleft'
    }).addTo(this.map);

    this.map.setView([0, 0], MAP_DEFAULTS.zoom.initial);
    this.initializeLayers();
  }

  cleanup(): void {
    if (this.map) {
      this.map.off();
      this.map.remove();
      this.map = null;
      this.layers = null;
    }
  }

  private initializeLayers(): void {
    if (!this.map) return;

    this.layers = {
      lines: L.layerGroup().addTo(this.map),
      points: L.layerGroup().addTo(this.map),
      labels: L.layerGroup().addTo(this.map)
    };
  }

  clearLayers(): void {
    if (!this.layers) return;
    Object.values(this.layers).forEach(layer => layer.clearLayers());
  }

  addPoint(point: Point, style = MAP_DEFAULTS.style.point): void {
    if (!this.layers) {
      throw new Error('Map not initialized');
    }

    if (!this.isValidCoordinate(point.x) || !this.isValidCoordinate(point.y)) {
      throw new Error('Invalid coordinates');
    }

    if (!this.isValidStyle(style)) {
      throw new Error('Invalid style configuration');
    }

    const marker = L.circleMarker(
      [point.y, point.x],
      {
        radius: (style.size || 1) * 2,
        color: style.color,
        weight: style.weight,
        opacity: style.opacity,
        fillColor: style.color,
        fillOpacity: style.opacity
      }
    );

    this.layers.points.addLayer(marker);
  }

  addLine(start: Point, end: Point, style = MAP_DEFAULTS.style.line): void {
    if (!this.layers) {
      throw new Error('Map not initialized');
    }

    if (!this.isValidCoordinate(start.x) || !this.isValidCoordinate(start.y) ||
        !this.isValidCoordinate(end.x) || !this.isValidCoordinate(end.y)) {
      throw new Error('Invalid coordinates');
    }

    if (!this.isValidStyle(style)) {
      throw new Error('Invalid style configuration');
    }

    const line = L.polyline(
      [[start.y, start.x], [end.y, end.x]],
      {
        color: style.color,
        weight: style.weight,
        opacity: style.opacity
      }
    );

    this.layers.lines.addLayer(line);
  }

  addLabel(position: Point, text: string, style = MAP_DEFAULTS.style.label): void {
    if (!this.layers) {
      throw new Error('Map not initialized');
    }

    if (!this.isValidCoordinate(position.x) || !this.isValidCoordinate(position.y)) {
      throw new Error('Invalid coordinates');
    }

    if (!this.isValidStyle(style)) {
      throw new Error('Invalid style configuration');
    }

    const icon = L.divIcon({
      className: 'map-label',
      html: `
        <div class="map-label-content" style="
          color: ${style.color};
          font-size: ${style.fontSize}px;
          opacity: ${style.opacity};
        ">${text}</div>
      `,
      iconSize: [0, 0]
    });

    const marker = L.marker([position.y, position.x], { icon });
    this.layers.labels.addLayer(marker);
  }

  private isValidCoordinate(value: number): boolean {
    return typeof value === 'number' && isFinite(value);
  }

  private isValidStyle(style: any): boolean {
    return style &&
           typeof style.color === 'string' && style.color.length > 0 &&
           typeof style.weight === 'number' && style.weight > 0 &&
           typeof style.opacity === 'number' && style.opacity >= 0 && style.opacity <= 1;
  }
}

export const mapService = new MapService();