<script setup lang="ts">
import { computed } from 'vue';
import type { Project } from '../../features/projects/types';
import ProjectList from '../projects/ProjectList.vue';
import ProjectHeader from '../projects/ProjectHeader.vue';
import ProjectContent from './ProjectContent.vue';
import { useProjectState } from '../../features/projects/composables/useProjectState';

const { 
  projects, 
  currentProject,
  addProject,
  updateProject,
  deleteProject,
  setCurrentProject 
} = useProjectState();

const hasProjects = computed(() => projects.value.length > 0);

function handleEditProject(project: Project) {
  updateProject(project.id, project);
}

function handleDeleteProject(projectId: string) {
  deleteProject(projectId);
}
</script>

<template>
  <div class="w-64 bg-gray-800 text-white h-screen flex flex-col">
    <ProjectHeader 
      :current-project="currentProject"
      @add-project="addProject" 
    />
    
    <div v-if="hasProjects" class="flex-1 overflow-hidden flex flex-col">
      <div class="overflow-y-auto">
        <ProjectList
          :projects="projects"
          :current-project="currentProject"
          @select-project="setCurrentProject"
          @edit-project="handleEditProject"
          @delete-project="handleDeleteProject"
        />
      </div>
      
      <ProjectContent class="flex-1" />
    </div>
    
    <div v-else class="flex-1 flex items-center justify-center p-4 text-center text-gray-400">
      <p>Create your first project to get started</p>
    </div>
  </div>
</template>