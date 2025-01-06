import { computed } from 'vue';
import type { Deed } from '../types';
import { deedService } from '../services/DeedService';
import { projectService } from '../services/ProjectService';

export function useDeedService() {
  const currentProject = computed(() => projectService.getCurrentProject());
  const projectDeeds = computed(() => 
    currentProject.value ? deedService.getProjectDeeds(currentProject.value.id) : []
  );

  return {
    // State
    projectDeeds,

    // Actions
    addDeed: deedService.addDeed.bind(deedService),
    updateDeed: deedService.updateDeed.bind(deedService),
    deleteDeed: deedService.deleteDeed.bind(deedService),
    getDeed: deedService.getDeed.bind(deedService)
  };
}