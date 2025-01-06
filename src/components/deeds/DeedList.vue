<script setup lang="ts">
import { ref } from 'vue';
import type { Deed } from '../../features/projects/types';

const props = defineProps<{
  deeds: Deed[];
  currentDeed: Deed | null;
}>();

const emit = defineEmits<{
  (e: 'selectDeed', deedId: string): void;
  (e: 'editDeed', deed: Deed): void;
  (e: 'deleteDeed', deedId: string): void;
}>();

const editingDeed = ref<Deed | null>(null);
const editName = ref('');

function startEditing(deed: Deed) {
  editingDeed.value = deed;
  editName.value = deed.name;
}

function saveEdit() {
  if (!editingDeed.value || !editName.value.trim()) return;
  
  emit('editDeed', {
    ...editingDeed.value,
    name: editName.value.trim()
  });
  
  editingDeed.value = null;
  editName.value = '';
}

function cancelEdit() {
  editingDeed.value = null;
  editName.value = '';
}
</script>

<template>
  <div class="py-2">
    <div
      v-for="deed in deeds"
      :key="deed.id"
      class="group px-4 py-2 hover:bg-gray-700 transition-colors"
      :class="{ 'bg-gray-700': currentDeed?.id === deed.id }"
    >
      <div v-if="editingDeed?.id === deed.id" class="space-y-2">
        <input
          v-model="editName"
          type="text"
          class="w-full px-2 py-1 bg-gray-600 rounded text-white"
          @keyup.enter="saveEdit"
          @keyup.esc="cancelEdit"
        />
        <div class="flex justify-end space-x-2">
          <button
            class="px-2 py-1 text-sm bg-gray-600 rounded hover:bg-gray-500"
            @click="cancelEdit"
          >
            Cancel
          </button>
          <button
            class="px-2 py-1 text-sm bg-blue-600 rounded hover:bg-blue-500"
            @click="saveEdit"
          >
            Save
          </button>
        </div>
      </div>
      
      <div v-else class="flex items-center justify-between">
        <button
          class="flex-1 text-left"
          @click="emit('selectDeed', deed.id)"
        >
          <h3 class="font-medium truncate">{{ deed.name }}</h3>
          <p v-if="deed.description" class="text-sm text-gray-400 truncate">
            {{ deed.description }}
          </p>
        </button>
        
        <div class="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            class="p-1 text-gray-400 hover:text-white"
            @click="startEditing(deed)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
          <button
            class="p-1 text-gray-400 hover:text-red-500"
            @click="emit('deleteDeed', deed.id)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>