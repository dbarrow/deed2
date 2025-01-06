import L from 'leaflet';

export function initializeMap(container: HTMLElement): L.Map {
  container.innerHTML = '';

  const map = L.map(container, {
    crs: L.CRS.Simple,
    minZoom: -3,
    maxZoom: 3,
    zoomControl: false,
    attributionControl: false
  });

  L.control.zoom({
    position: 'topleft'
  }).addTo(map);

  map.setView([0, 0], 0);
  return map;
}