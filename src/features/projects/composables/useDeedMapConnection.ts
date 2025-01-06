import { ref, watch } from 'vue';
import type { Point, DeedCall } from '../../../types';
import { useProjectState } from './useProjectState';
import { useDeedState } from './useDeedState';

export function useDeedMapConnection() {
  const pobCoordinates = ref<Point>({ x: 1000, y: 1000 });
  const deedCalls = ref<DeedCall[]>([]);
  
  const { currentProject, currentDeed } = useProjectState();

  // Watch for deed changes
  watch(() => currentDeed.value, (deed) => {
    if (!deed) {
      pobCoordinates.value = { x: 1000, y: 1000 };
      deedCalls.value = [];
      return;
    }

    // Only update if values are different
    if (JSON.stringify(deed.pobCoordinates) !== JSON.stringify(pobCoordinates.value)) {
      pobCoordinates.value = { ...deed.pobCoordinates };
    }
    if (JSON.stringify(deed.calls) !== JSON.stringify(deedCalls.value)) {
      deedCalls.value = [...deed.calls];
    }
  }, { immediate: true });

  // Debounced update function
  let updateTimeout: number | null = null;
  function debouncedUpdate() {
    if (updateTimeout) {
      clearTimeout(updateTimeout);
    }
    
    updateTimeout = window.setTimeout(() => {
      if (!currentProject.value?.id || !currentDeed.value?.id) return;

      const { updateDeed } = useDeedState(currentProject.value.id);
      updateDeed(currentDeed.value.id, {
        pobCoordinates: pobCoordinates.value,
        calls: deedCalls.value
      });
    }, 100);
  }

  // Watch for local changes
  watch([pobCoordinates, deedCalls], () => {
    debouncedUpdate();
  }, { deep: true });

  return {
    pobCoordinates,
    deedCalls,
    updatePobCoordinates: (coords: Point) => {
      pobCoordinates.value = { ...coords };
    },
    addCall: (call: DeedCall) => {
      deedCalls.value = [...deedCalls.value, call];
    },
    deleteCall: (index: number) => {
      deedCalls.value = deedCalls.value.filter((_, i) => i !== index);
    }
  };
}