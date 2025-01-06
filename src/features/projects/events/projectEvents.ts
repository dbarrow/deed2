import { ref, watch } from 'vue';
import type { Project } from '../types';

export interface ProjectEvent {
  type: 'created' | 'updated' | 'deleted' | 'selected';
  project: Project;
}

const projectEvents = ref<ProjectEvent[]>([]);

export const projectEventEmitter = {
  emit(event: ProjectEvent) {
    projectEvents.value = [...projectEvents.value, event];
    if (projectEvents.value.length > 100) {
      projectEvents.value = projectEvents.value.slice(-100);
    }
  },

  onProjectEvent(callback: (events: ProjectEvent[]) => void) {
    return watch(projectEvents, callback, { immediate: true });
  },

  // For testing purposes only
  getEvents() {
    return projectEvents.value;
  },

  // For testing purposes only
  clearEvents() {
    projectEvents.value = [];
  }
};