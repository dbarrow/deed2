<template>
  <div class="call-card border-b border-gray-200 hover:bg-gray-50"
       :class="{
         'opacity-50': isDragging,
         'border-2 border-blue-500': isDropTarget
       }"
       draggable="true"
       @dragstart="(e) => $emit('dragstart', index, e)"
       @dragover="(e) => $emit('dragover', index, e)"
       @drop="() => $emit('drop', index)"
       @dragend="$emit('dragend')">
    
    <div class="grid grid-cols-12 gap-2 px-3 py-2 items-center text-sm">
      <!-- Drag Handle - Left side -->
      <div class="col-span-1 cursor-move text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      </div>

      <!-- Call Number -->
      <div class="col-span-1 font-medium text-gray-500">{{ index + 1 }}</div>

      <!-- Type -->
      <div class="col-span-1">{{ call.type }}</div>

      <!-- Line Call Details -->
      <template v-if="call.type === 'line'">
        <div class="col-span-5">{{ formatBearing(call.bearing) }}</div>
        <div class="col-span-3">{{ call.distance }} {{ call.unit }}</div>
      </template>
      
      <!-- Curve Call Details -->
      <template v-else>
        <div class="col-span-3">R: {{ call.curve.radius }}</div>
        <div class="col-span-2">{{ call.curve.lengthType === 'arc' ? 'Arc:' : 'Chord:' }} {{ call.curve.length }}</div>
        <div class="col-span-2">{{ call.curve.direction === 'clockwise' ? 'CW' : 'CCW' }}</div>
        <div class="col-span-1">{{ call.unit }}</div>
      </template>

      <!-- Actions - Right side -->
      <div class="col-span-1 flex justify-end space-x-2">
        <button @click="$emit('edit')"
                class="text-gray-400 hover:text-blue-500 transition-colors"
                title="Edit call">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </button>
        <button @click="$emit('delete')"
                class="text-gray-400 hover:text-red-500 transition-colors"
                title="Delete call">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { DeedCall } from '../types';
import type { Point } from '../utils/geometry/types';
import { formatBearing } from '../utils/bearingCalculations';

const props = defineProps<{
  call: DeedCall;
  index: number;
  calculatedCoordinates: Point[];
  isDragging?: boolean;
  isDropTarget?: boolean;
}>();

const emit = defineEmits<{
  (e: 'delete'): void;
  (e: 'edit'): void;
  (e: 'dragstart', index: number, event: DragEvent): void;
  (e: 'dragover', index: number, event: DragEvent): void;
  (e: 'drop', index: number): void;
  (e: 'dragend'): void;
}>();
</script>

<style scoped>
.call-card {
  transition: background-color 0.2s ease;
}
</style>