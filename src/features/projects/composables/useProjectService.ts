import { ref, computed } from 'vue';
import type { Project } from '../types';
import { projectService } from '../services/ProjectService';

export function useProjectService() {
  const projects = computed(() => projectService.getProjects());
  const currentProject = computed(() => projectService.getCurrentProject());

  return {
    // State
    projects,
    currentProject,

    // Actions
    addProject: projectService.addProject.bind(projectService),
    updateProject: projectService.updateProject.bind(projectService),
    deleteProject: projectService.deleteProject.bind(projectService),
    setCurrentProject: projectService.setCurrentProject.bind(projectService)
  };
}