import { ref, watch } from 'vue';
import type { Deed } from '../types';

export interface DeedEvent {
  type: 'created' | 'updated' | 'deleted' | 'selected';
  deed: Deed;
  projectId: string;
}

const deedEvents = ref<DeedEvent[]>([]);

export const deedEventEmitter = {
  emit(event: DeedEvent) {
    deedEvents.value = [...deedEvents.value, event];
    if (deedEvents.value.length > 100) {
      deedEvents.value = deedEvents.value.slice(-100);
    }
  },

  onDeedEvent(callback: (events: DeedEvent[]) => void) {
    return watch(deedEvents, callback, { immediate: true });
  },

  // For testing purposes only
  getEvents() {
    return deedEvents.value;
  },

  // For testing purposes only
  clearEvents() {
    deedEvents.value = [];
  }
};