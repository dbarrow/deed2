```vue
<script setup lang="ts">
import { computed } from 'vue';
import { useProjectState } from '../../features/projects/composables/useProjectState';

const { currentProject } = useProjectState();

const projectStats = computed(() => {
  if (!currentProject.value) return null;
  
  return {
    createdAt: new Date(currentProject.value.createdAt).toLocaleDateString(),
    updatedAt: new Date(currentProject.value.updatedAt).toLocaleDateString()
  };
});
</script>

<template>
  <div v-if="currentProject" class="flex-1 p-4">
    <div class="space-y-4">
      <div class="bg-gray-700 rounded-lg p-4">
        <h2 class="text-lg font-semibold text-white mb-2">{{ currentProject.name }}</h2>
        <p v-if="currentProject.description" class="text-gray-300 text-sm">
          {{ currentProject.description }}
        </p>
      </div>
      
      <div v-if="projectStats" class="text-sm text-gray-400">
        <p>Created: {{ projectStats.createdAt }}</p>
        <p>Last modified: {{ projectStats.updatedAt }}</p>
      </div>
    </div>
  </div>
  
  <div v-else class="flex-1 flex items-center justify-center">
    <p class="text-gray-500">Select a project to view details</p>
  </div>
</template>
```