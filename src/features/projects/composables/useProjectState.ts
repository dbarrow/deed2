import { ref, computed } from 'vue';
import type { Project, Deed, ProjectState } from '../types';
import { useDeedState } from './useDeedState';

const state = ref<ProjectState>({
  projects: [],
  currentProjectId: null,
  currentDeedId: null
});

export function useProjectState() {
  const currentProject = computed(() => 
    state.value.projects.find(p => p.id === state.value.currentProjectId)
  );

  const currentDeed = computed(() => {
    if (!state.value.currentProjectId || !state.value.currentDeedId) return null;
    
    const { getDeed } = useDeedState(state.value.currentProjectId);
    return getDeed(state.value.currentDeedId);
  });

  function addProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) {
    const newProject: Project = {
      ...project,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    state.value.projects.push(newProject);
    return newProject;
  }

  function updateProject(projectId: string, updates: Partial<Omit<Project, 'id' | 'createdAt' | 'updatedAt'>>) {
    const project = state.value.projects.find(p => p.id === projectId);
    if (!project) return null;

    Object.assign(project, {
      ...updates,
      updatedAt: new Date()
    });

    return project;
  }

  function deleteProject(projectId: string) {
    const index = state.value.projects.findIndex(p => p.id === projectId);
    if (index === -1) return false;

    state.value.projects.splice(index, 1);
    
    if (state.value.currentProjectId === projectId) {
      state.value.currentProjectId = null;
      state.value.currentDeedId = null;
    }

    return true;
  }

  function setCurrentProject(projectId: string | null) {
    state.value.currentProjectId = projectId;
    state.value.currentDeedId = null;
  }

  function setCurrentDeed(deedId: string | null) {
    state.value.currentDeedId = deedId;
  }

  return {
    // State
    projects: computed(() => state.value.projects),
    currentProject,
    currentDeed,
    currentProjectId: computed(() => state.value.currentProjectId),
    currentDeedId: computed(() => state.value.currentDeedId),

    // Actions
    addProject,
    updateProject,
    deleteProject,
    setCurrentProject,
    setCurrentDeed
  };
}