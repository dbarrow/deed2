import L from 'leaflet';
import type { Point } from '../../../types';
import type { LayerStyle } from '../composables/useMapStyles';

interface ScaledLabelOptions extends L.MarkerOptions {
  style?: LayerStyle;
  bearing?: string;
  distance?: string;
  rotation?: string;
}

export class ScaledLabel extends L.Marker {
  private _map: L.Map | null = null;
  private _content: HTMLDivElement | null = null;
  private _labelContent: HTMLDivElement | null = null;
  private _style: LayerStyle;
  private _bearing: string;
  private _distance: string;
  private _rotation: string;
  private _baseZoom: number = 0;

  constructor(latlng: L.LatLngExpression, options: ScaledLabelOptions) {
    super(latlng, { ...options, interactive: false });
    this._style = options.style || {};
    this._bearing = options.bearing || '';
    this._distance = options.distance || '';
    this._rotation = options.rotation || '0deg';
    this._createContent();
  }

  onAdd(map: L.Map): this {
    this._map = map;
    this._baseZoom = map.getZoom();
    
    map.on('zoomstart', this._updateScale, this);
    map.on('zoom', this._updateScale, this);
    map.on('zoomend', this._updateScale, this);
    
    super.onAdd(map);
    this._updateScale();
    
    return this;
  }

  onRemove(map: L.Map): this {
    if (this._map) {
      this._map.off('zoomstart', this._updateScale, this);
      this._map.off('zoom', this._updateScale, this);
      this._map.off('zoomend', this._updateScale, this);
    }
    
    if (this._content) {
      if (this._content.parentNode) {
        this._content.parentNode.removeChild(this._content);
      }
      this._content = null;
      this._labelContent = null;
    }
    
    super.onRemove(map);
    this._map = null;
    
    return this;
  }

  updateStyle(style: LayerStyle): void {
    this._style = { ...this._style, ...style };
    this._createContent();
    this._updateScale();
  }

  private _createContent(): void {
    const icon = L.divIcon({
      className: 'map-label',
      html: `
        <div class="map-label-content" style="transform: translate(-50%, -50%) rotate(${this._rotation})">
          <div class="label-background" style="
            color: ${this._style.color};
            font-size: ${this._style.fontSize}px;
            opacity: ${this._style.opacity};
          ">
            ${this._bearing}<br>${this._distance}
          </div>
        </div>
      `,
      iconSize: [0, 0],
      iconAnchor: [0, 0]
    });

    this.setIcon(icon);
    
    // Update references to new DOM elements
    const temp = document.createElement('div');
    temp.innerHTML = icon.options.html || '';
    this._content = temp.firstElementChild as HTMLDivElement;
    this._labelContent = this._content.querySelector('.label-background') as HTMLDivElement;
  }

  private _updateScale = () => {
    if (!this._map || !this._content) return;

    const zoom = this._map.getZoom();
    const zoomDiff = zoom - this._baseZoom;
    const scale = Math.pow(2, -zoomDiff);
    
    this._content.style.transform = `translate(-50%, -50%) rotate(${this._rotation}) scale(${scale})`;
  }
}

export function createScaledLabel(
  start: Point,
  end: Point,
  bearing: string,
  distance: string,
  style: LayerStyle
): ScaledLabel {
  const midpoint = {
    x: (start.x + end.x) / 2,
    y: (start.y + end.y) / 2
  };

  const angle = Math.atan2(end.y - start.y, end.x - start.x) * (180 / Math.PI);
  let rotation = angle;
  
  if (angle > 90 || angle < -90) {
    rotation += 180;
  }

  return new ScaledLabel([midpoint.y, midpoint.x], { 
    style,
    bearing,
    distance,
    rotation: `${rotation}deg`
  });
}