import { ref, watch, type Ref } from 'vue';
import L from 'leaflet';
import type { DeedCall, Point } from '../../../types';
import { useMapLayers } from './useMapLayers';
import { useMapStyles } from './useMapStyles';
import { calculatePlotPoints } from '../utils/plotUtils';
import { initializeMap } from '../utils/mapInitializer';

export function useMapRendering(
  pobCoordinates: Ref<Point>,
  deedCalls: Ref<DeedCall[]>
) {
  const map = ref<L.Map | null>(null);
  const { lineStyle, pointStyle, labelStyle } = useMapStyles();
  
  const { 
    layers,
    layerVisibility,
    initLayers,
    clearLayers,
    toggleLayer,
    addLine,
    addPoint,
    addLineLabel
  } = useMapLayers(map, lineStyle, pointStyle, labelStyle);

  function initMap(container: HTMLElement) {
    if (!container) return;

    // Clean up existing map if any
    if (map.value) {
      map.value.remove();
    }
    
    map.value = initializeMap(container);
    initLayers();
    
    // Initial plot
    requestAnimationFrame(() => {
      updatePlot();
    });
  }

  function updatePlot() {
    if (!map.value || !layers.value) return;
    
    clearLayers();
    
    const points = calculatePlotPoints(pobCoordinates.value, deedCalls.value);
    if (points.length === 0) return;
    
    points.forEach((point, index) => {
      addPoint(point.coordinates);
      
      if (index > 0) {
        const prevPoint = points[index - 1];
        addLine(prevPoint.coordinates, point.coordinates);
        
        if (point.distance && point.label) {
          addLineLabel(
            { x: prevPoint.coordinates[1], y: prevPoint.coordinates[0] },
            { x: point.coordinates[1], y: point.coordinates[0] },
            point.distance,
            point.label
          );
        }
      }
    });

    // Fit bounds with padding
    const bounds = L.latLngBounds(points.map(p => p.coordinates));
    map.value.fitBounds(bounds.pad(0.1));
  }

  // Watch for data changes with debounce
  let updateTimeout: number | null = null;
  watch([pobCoordinates, deedCalls], () => {
    if (updateTimeout) {
      window.clearTimeout(updateTimeout);
    }
    updateTimeout = window.setTimeout(() => {
      updatePlot();
    }, 100);
  }, { deep: true });

  return {
    lineStyle,
    pointStyle,
    labelStyle,
    layerVisibility,
    initMap,
    toggleLayer,
    updateLineStyle: (style: Partial<typeof lineStyle.value>) => {
      lineStyle.value = { ...lineStyle.value, ...style };
    },
    updatePointStyle: (style: Partial<typeof pointStyle.value>) => {
      pointStyle.value = { ...pointStyle.value, ...style };
    },
    updateLabelStyle: (style: Partial<typeof labelStyle.value>) => {
      labelStyle.value = { ...labelStyle.value, ...style };
    }
  };
}