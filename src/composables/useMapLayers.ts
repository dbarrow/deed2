import { ref, watch, type Ref } from 'vue';
import L from 'leaflet';
import type { LayerStyle } from './useMapStyles';
import type { Point } from '../types';
import { ScaledLabel, createScaledLabel } from '../utils/map/ScaledLabel';
import { formatBearing } from '../utils/bearingCalculations';

export function useMapLayers(
  map: Ref<L.Map | null>,
  lineStyle: Ref<LayerStyle>,
  pointStyle: Ref<LayerStyle>,
  labelStyle: Ref<LayerStyle>
) {
  // Layer groups
  const layers = ref<{
    lines: L.LayerGroup;
    points: L.LayerGroup;
    labels: L.LayerGroup;
  } | null>(null);

  // Layer visibility state
  const layerVisibility = ref({
    lines: true,
    points: true,
    labels: true
  });

  // Initialize layer groups
  function initLayers() {
    if (!map.value) return;

    layers.value = {
      lines: L.layerGroup().addTo(map.value),
      points: L.layerGroup().addTo(map.value),
      labels: L.layerGroup().addTo(map.value)
    };
  }

  // Clear all layers
  function clearLayers() {
    if (!layers.value) return;
    
    Object.values(layers.value).forEach(layer => {
      layer.clearLayers();
    });
  }

  // Toggle layer visibility
  function toggleLayer(layerName: string, visible: boolean) {
    if (!layers.value || !map.value) return;
    
    layerVisibility.value[layerName as keyof typeof layerVisibility.value] = visible;
    
    if (visible) {
      layers.value[layerName as keyof typeof layers.value].addTo(map.value);
    } else {
      layers.value[layerName as keyof typeof layers.value].removeFrom(map.value);
    }
  }

  // Add line to map
  function addLine(start: [number, number], end: [number, number]) {
    if (!layers.value) return;

    const line = L.polyline([start, end], {
      color: lineStyle.value.color,
      weight: lineStyle.value.weight,
      opacity: lineStyle.value.opacity
    });

    layers.value.lines.addLayer(line);
  }

  // Add point to map
  function addPoint(coords: [number, number], size?: number) {
    if (!layers.value) return;

    const point = L.circleMarker(coords, {
      radius: (size || pointStyle.value.size || 1) * 2,
      color: pointStyle.value.color,
      weight: pointStyle.value.weight,
      opacity: pointStyle.value.opacity,
      fillColor: pointStyle.value.color,
      fillOpacity: pointStyle.value.opacity
    });

    layers.value.points.addLayer(point);
  }

  // Add label to map
  function addLineLabel(start: Point, end: Point, distance: string, bearing: string) {
    if (!layers.value) return;

    const formattedBearing = formatBearing(bearing);
    const label = createScaledLabel(
      start,
      end,
      formattedBearing,
      distance,
      labelStyle.value
    );
    
    layers.value.labels.addLayer(label);
  }

  // Update styles for existing layers
  function updateStyles() {
    if (!layers.value) return;

    // Update lines
    layers.value.lines.eachLayer(layer => {
      if (layer instanceof L.Polyline) {
        layer.setStyle({
          color: lineStyle.value.color,
          weight: lineStyle.value.weight,
          opacity: lineStyle.value.opacity
        });
      }
    });

    // Update points
    layers.value.points.eachLayer(layer => {
      if (layer instanceof L.CircleMarker) {
        layer.setStyle({
          radius: (pointStyle.value.size || 1) * 2,
          color: pointStyle.value.color,
          weight: pointStyle.value.weight,
          opacity: pointStyle.value.opacity,
          fillColor: pointStyle.value.color,
          fillOpacity: pointStyle.value.opacity
        });
      }
    });

    // Update labels
    layers.value.labels.eachLayer(layer => {
      if (layer instanceof ScaledLabel) {
        layer.updateStyle(labelStyle.value);
      }
    });
  }

  // Watch for style changes
  watch([lineStyle, pointStyle, labelStyle], () => {
    updateStyles();
  }, { deep: true });

  return {
    layers,
    layerVisibility,
    initLayers,
    clearLayers,
    toggleLayer,
    addLine,
    addPoint,
    addLineLabel
  };
}