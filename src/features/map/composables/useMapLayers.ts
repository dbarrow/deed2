import { ref, watch, type Ref } from 'vue';
import L from 'leaflet';
import type { LayerStyle } from './useMapStyles';
import type { Point } from '../../../types';
import { ScaledLabel, createScaledLabel } from '../utils/ScaledLabel';

export function useMapLayers(
  map: Ref<L.Map | null>,
  lineStyle: Ref<LayerStyle>,
  pointStyle: Ref<LayerStyle>,
  labelStyle: Ref<LayerStyle>
) {
  const layers = ref<{
    lines: L.LayerGroup;
    points: L.LayerGroup;
    labels: L.LayerGroup;
  } | null>(null);

  const layerVisibility = ref({
    lines: true,
    points: true,
    labels: true
  });

  function initLayers() {
    if (!map.value) return;

    // Clear existing layers if any
    if (layers.value) {
      Object.values(layers.value).forEach(layer => {
        if (map.value?.hasLayer(layer)) {
          layer.removeFrom(map.value);
        }
      });
    }

    // Create new layers
    layers.value = {
      lines: L.layerGroup().addTo(map.value),
      points: L.layerGroup().addTo(map.value),
      labels: L.layerGroup().addTo(map.value)
    };
  }

  function clearLayers() {
    if (!layers.value) return;
    Object.values(layers.value).forEach(layer => layer.clearLayers());
  }

  function toggleLayer(layerName: keyof typeof layerVisibility.value, visible: boolean) {
    if (!layers.value || !map.value) return;
    
    layerVisibility.value[layerName] = visible;
    const layer = layers.value[layerName];
    
    if (visible && !map.value.hasLayer(layer)) {
      layer.addTo(map.value);
    } else if (!visible && map.value.hasLayer(layer)) {
      layer.removeFrom(map.value);
    }
  }

  function addLine(start: [number, number], end: [number, number]) {
    if (!layers.value) return;

    const line = L.polyline([start, end], {
      color: lineStyle.value.color,
      weight: lineStyle.value.weight,
      opacity: lineStyle.value.opacity
    });

    layers.value.lines.addLayer(line);
  }

  function addPoint(coords: [number, number]) {
    if (!layers.value) return;

    const point = L.circleMarker(coords, {
      radius: (pointStyle.value.size || 1) * 2,
      color: pointStyle.value.color,
      weight: pointStyle.value.weight,
      opacity: pointStyle.value.opacity,
      fillColor: pointStyle.value.color,
      fillOpacity: pointStyle.value.opacity
    });

    layers.value.points.addLayer(point);
  }

  function addLineLabel(start: Point, end: Point, distance: string, bearing: string) {
    if (!layers.value) return;

    const label = createScaledLabel(
      start,
      end,
      bearing,
      distance,
      labelStyle.value
    );

    layers.value.labels.addLayer(label);
  }

  // Update styles when they change
  watch([lineStyle, pointStyle, labelStyle], () => {
    if (!layers.value) return;

    // Update existing layers with new styles
    layers.value.lines.eachLayer(layer => {
      if (layer instanceof L.Polyline) {
        layer.setStyle({
          color: lineStyle.value.color,
          weight: lineStyle.value.weight,
          opacity: lineStyle.value.opacity
        });
      }
    });

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

    layers.value.labels.eachLayer(layer => {
      if (layer instanceof ScaledLabel) {
        layer.updateStyle(labelStyle.value);
      }
    });
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