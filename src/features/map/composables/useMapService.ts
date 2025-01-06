import { ref, onMounted, onUnmounted } from 'vue';
import type { Point } from '../../../types';
import { mapService } from '../services/MapService';
import { MAP_DEFAULTS } from '../config/mapDefaults';

export function useMapService() {
  const container = ref<HTMLElement | null>(null);

  onMounted(() => {
    if (container.value) {
      mapService.initialize(container.value);
    }
  });

  onUnmounted(() => {
    // Cleanup if needed
  });

  return {
    container,
    addPoint: (point: Point) => mapService.addPoint(point),
    clearLayers: () => mapService.clearLayers(),
    // Add other map operations as needed
  };
}