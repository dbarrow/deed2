<script setup lang="ts">
import { ref } from 'vue';
import type { Project } from '../../features/projects/types';

const props = defineProps<{
  currentProject: Project | null;
}>();

const emit = defineEmits<{
  (e: 'addProject', project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): void;
}>();

const isCreating = ref(false);
const newProjectName = ref('');

function handleAddProject() {
  if (!newProjectName.value.trim()) return;
  
  emit('addProject', {
    name: newProjectName.value.trim(),
    description: ''
  });
  
  newProjectName.value = '';
  isCreating.value = false;
}
</script>

<template>
  <div class="p-4 border-b border-gray-700">
    <div v-if="isCreating" class="space-y-2">
      <input
        v-model="newProjectName"
        type="text"
        placeholder="Project name"
        class="w-full px-3 py-2 bg-gray-700 rounded text-white placeholder-gray-400"
        @keyup.enter="handleAddProject"
        @keyup.esc="isCreating = false"
      />
      <div class="flex justify-end space-x-2">
        <button
          class="px-3 py-1 text-sm bg-gray-700 rounded hover:bg-gray-600"
          @click="isCreating = false"
        >
          Cancel
        </button>
        <button
          class="px-3 py-1 text-sm bg-blue-600 rounded hover:bg-blue-500"
          @click="handleAddProject"
        >
          Create
        </button>
      </div>
    </div>
    
    <div v-else class="flex justify-between items-center">
      <h2 class="text-lg font-semibold">Projects</h2>
      <button
        class="p-2 text-gray-400 hover:text-white"
        @click="isCreating = true"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>
  </div>
</template>