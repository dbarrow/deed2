<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Deed } from '../../features/projects/types';

const props = defineProps<{
  deeds: Deed[];
  currentDeed: Deed | null;
}>();

const emit = defineEmits<{
  (e: 'selectDeed', deedId: string): void;
  (e: 'closeDeed', deedId: string): void;
  (e: 'addDeed'): void;
  (e: 'updateDeed', deed: Deed): void;
}>();

const editingTab = ref<string | null>(null);
const editName = ref('');

const tabsContainer = ref<HTMLElement | null>(null);
const isScrollable = ref(false);

function startEditing(deed: Deed, event: Event) {
  event.stopPropagation();
  editingTab.value = deed.id;
  editName.value = deed.name;
}

function saveEdit(deed: Deed) {
  if (!editName.value.trim()) {
    editingTab.value = null;
    return;
  }
  
  emit('updateDeed', { ...deed, name: editName.value.trim() });
  editingTab.value = null;
}

function handleKeydown(deed: Deed, event: KeyboardEvent) {
  if (event.key === 'Enter') {
    saveEdit(deed);
  } else if (event.key === 'Escape') {
    editingTab.value = null;
  }
}

function checkScrollable() {
  if (!tabsContainer.value) return;
  const { scrollWidth, clientWidth } = tabsContainer.value;
  isScrollable.value = scrollWidth > clientWidth;
}

function scrollTabs(direction: 'left' | 'right') {
  if (!tabsContainer.value) return;
  const scrollAmount = 200;
  tabsContainer.value.scrollLeft += direction === 'left' ? -scrollAmount : scrollAmount;
}
</script>

<template>
  <div class="flex items-center bg-gray-100 border-b border-gray-200">
    <!-- Scroll Left Button -->
    <button
      v-show="isScrollable"
      @click="scrollTabs('left')"
      class="flex-shrink-0 p-2 text-gray-500 hover:text-gray-700"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
      </svg>
    </button>

    <!-- Tabs -->
    <div
      ref="tabsContainer"
      class="flex-1 flex overflow-x-auto scrollbar-hide"
      @scroll="checkScrollable"
    >
      <div
        v-for="deed in deeds"
        :key="deed.id"
        class="flex-shrink-0"
      >
        <div
          class="group flex items-center px-4 py-2 border-r border-gray-200 hover:bg-white"
          :class="{ 'bg-white': currentDeed?.id === deed.id }"
        >
          <!-- Tab Content -->
          <template v-if="editingTab === deed.id">
            <input
              v-model="editName"
              type="text"
              class="w-32 px-2 py-1 bg-white border rounded"
              @keydown="handleKeydown(deed, $event)"
              @blur="saveEdit(deed)"
              @click.stop
            />
          </template>
          <template v-else>
            <button
              @click="emit('selectDeed', deed.id)"
              class="flex items-center"
            >
              <span class="truncate max-w-[150px]">{{ deed.name }}</span>
            </button>
            <div class="flex ml-2 opacity-0 group-hover:opacity-100">
              <button
                @click="startEditing(deed, $event)"
                class="p-1 text-gray-400 hover:text-gray-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793z" />
                  <path d="M11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
              <button
                @click="emit('closeDeed', deed.id)"
                class="p-1 text-gray-400 hover:text-red-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </template>
        </div>
      </div>

      <!-- New Tab Button -->
      <button
        @click="emit('addDeed')"
        class="flex-shrink-0 flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-white"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>

    <!-- Scroll Right Button -->
    <button
      v-show="isScrollable"
      @click="scrollTabs('right')"
      class="flex-shrink-0 p-2 text-gray-500 hover:text-gray-700"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
      </svg>
    </button>
  </div>
</template>

<style scoped>
.scrollbar-hide {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>