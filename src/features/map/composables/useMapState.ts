import { ref } from 'vue';
import type { Point, DeedCall } from '../../../types';

export function useMapState() {
  const pobCoordinates = ref<Point>({ x: 1000, y: 1000 });
  const deedCalls = ref<DeedCall[]>([]);

  const updatePobCoordinates = (coords: Point) => {
    pobCoordinates.value = coords;
  };

  const addCall = (call: DeedCall) => {
    deedCalls.value.push(call);
  };

  const deleteCall = (index: number) => {
    deedCalls.value.splice(index, 1);
  };

  return {
    pobCoordinates,
    deedCalls,
    updatePobCoordinates,
    addCall,
    deleteCall
  };
}