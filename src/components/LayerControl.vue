<template>
  <div class="layer-control bg-white rounded-lg shadow-sm min-w-[250px]">
    <!-- Header with expand/collapse button -->
    <div class="p-3 flex items-center justify-between border-b border-gray-200 cursor-pointer"
         @click="isExpanded = !isExpanded">
      <h3 class="text-sm font-medium">Layer Controls</h3>
      <button class="text-gray-500 hover:text-gray-700 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" 
             class="h-4 w-4 transform transition-transform"
             :class="{ 'rotate-180': !isExpanded }"
             viewBox="0 0 20 20" 
             fill="currentColor">
          <path fill-rule="evenodd" 
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
                clip-rule="evenodd" />
        </svg>
      </button>
    </div>
    
    <!-- Expandable content -->
    <div v-show="isExpanded" class="p-3">
      <!-- Layer Visibility -->
      <div class="space-y-2">
        <div v-for="(visible, name) in layerVisibility" :key="name" 
             class="flex items-center justify-between">
          <label class="flex items-center space-x-2 cursor-pointer">
            <input type="checkbox"
                   :checked="visible"
                   @change="e => $emit('toggleLayer', name, e.target.checked)"
                   class="rounded text-blue-500" />
            <span class="text-sm capitalize">{{ name }}</span>
          </label>
          
          <!-- Settings Button -->
          <button v-if="['lines', 'points', 'labels'].includes(name)"
                  @click="toggleSettings(name)"
                  class="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                  :class="{ 'text-blue-500': isSettingsOpen(name) }">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Style Settings -->
      <StyleSettings
        v-if="showLineSettings"
        :style-config="lineStyle"
        label="Line Style"
        type="line"
        class="mt-4"
        @update="updateStyle('line', $event)"
      />

      <StyleSettings
        v-if="showPointSettings"
        :style-config="pointStyle"
        label="Point Style"
        type="point"
        class="mt-4"
        @update="updateStyle('point', $event)"
      />

      <StyleSettings
        v-if="showLabelSettings"
        :style-config="labelStyle"
        label="Label Style"
        type="label"
        class="mt-4"
        @update="updateStyle('label', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { LayerStyle } from '../composables/useMapStyles';
import StyleSettings from './StyleSettings.vue';

defineProps<{
  lineStyle: LayerStyle;
  pointStyle: LayerStyle;
  labelStyle: LayerStyle;
  layerVisibility: Record<string, boolean>;
}>();

const emit = defineEmits<{
  (e: 'updateLineStyle', style: Partial<LayerStyle>): void;
  (e: 'updatePointStyle', style: Partial<LayerStyle>): void;
  (e: 'updateLabelStyle', style: Partial<LayerStyle>): void;
  (e: 'toggleLayer', layer: string, visible: boolean): void;
}>();

const isExpanded = ref(true);
const showLineSettings = ref(false);
const showPointSettings = ref(false);
const showLabelSettings = ref(false);

function toggleSettings(type: string) {
  showLineSettings.value = type === 'lines';
  showPointSettings.value = type === 'points';
  showLabelSettings.value = type === 'labels';
}

function isSettingsOpen(type: string) {
  return (type === 'lines' && showLineSettings.value) || 
         (type === 'points' && showPointSettings.value) || 
         (type === 'labels' && showLabelSettings.value);
}

function updateStyle(type: 'line' | 'point' | 'label', style: Partial<LayerStyle>) {
  switch (type) {
    case 'line':
      emit('updateLineStyle', style);
      break;
    case 'point':
      emit('updatePointStyle', style);
      break;
    case 'label':
      emit('updateLabelStyle', style);
      break;
  }
}
</script>

<style scoped>
.layer-control {
  transition: all 0.2s ease-in-out;
}
</style>