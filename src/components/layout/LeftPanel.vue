<script setup lang="ts">
import type { DeedCall, Point } from '../../types';
import PointOfBeginning from '../PointOfBeginning.vue';
import DataEntryCard from '../DataEntryCard.vue';
import CallCard from '../CallCard.vue';

defineProps<{
  pobCoordinates: Point;
  deedCalls: DeedCall[];
  calculatedCoordinates: Point[];
  precision: number;
  errorClosure: number;
  draggedItem: number | null;
  dragTarget: number | null;
}>();

const emit = defineEmits<{
  (e: 'updatePob', coords: Point): void;
  (e: 'addCall', call: DeedCall): void;
  (e: 'deleteCall', index: number): void;
  (e: 'dragstart', index: number, event: DragEvent): void;
  (e: 'dragover', index: number, event: DragEvent): void;
  (e: 'drop', index: number): void;
  (e: 'dragend'): void;
}>();
</script>

<template>
  <div class="w-2/5 p-4 overflow-y-auto">
    <h1 class="text-2xl font-bold mb-6">Deed Plotting Tool</h1>
    
    <PointOfBeginning
      :pob-coordinates="pobCoordinates"
      @update="coords => emit('updatePob', coords)"
    />

    <DataEntryCard
      @add-call="call => emit('addCall', call)"
    />

    <!-- Calls List -->
    <div class="bg-white rounded-lg shadow-sm mb-6">
      <div class="p-4 border-b border-gray-200">
        <h2 class="text-lg font-semibold">Calls List</h2>
      </div>
      
      <div v-if="deedCalls.length === 0" class="p-8 text-center text-gray-500">
        No calls added yet. Use the form above to add your first call.
      </div>
      
      <div v-else class="divide-y divide-gray-100">
        <CallCard
          v-for="(call, index) in deedCalls"
          :key="index"
          :call="call"
          :index="index"
          :calculated-coordinates="calculatedCoordinates"
          :is-dragging="draggedItem === index"
          :is-drop-target="dragTarget === index"
          @delete="emit('deleteCall', index)"
          @dragstart="(e) => emit('dragstart', index, e)"
          @dragover="(e) => emit('dragover', index, e)"
          @drop="() => emit('drop', index)"
          @dragend="emit('dragend')"
        />
      </div>

      <!-- Results Footer -->
      <div class="border-t border-gray-200 p-4 bg-gray-50">
        <div class="flex justify-between items-center text-sm">
          <span class="text-gray-600">Precision:</span>
          <span class="font-medium">1:{{ precision.toFixed(2) }}</span>
        </div>
        <div class="flex justify-between items-center text-sm mt-2">
          <span class="text-gray-600">Error of Closure:</span>
          <span class="font-medium">{{ errorClosure.toFixed(2) }} ft</span>
        </div>
      </div>
    </div>
  </div>
</template>