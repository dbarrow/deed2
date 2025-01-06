<script setup lang="ts">
import type { Point } from '../types';

defineProps<{
  pobCoordinates: Point;
  onUpdate: (coordinates: Point) => void;
}>();
</script>

<template>
  <div class="pob-inputs p-4 bg-white rounded-lg shadow-sm mb-6">
    <h2 class="text-lg font-semibold mb-4">Point of Beginning</h2>
    <div class="grid grid-cols-2 gap-4">
      <div class="flex flex-col">
        <label class="text-sm font-medium text-gray-700">POB N:</label>
        <input
          type="number"
          :value="pobCoordinates.x"
          @input="e => onUpdate({ ...pobCoordinates, x: Number((e.target as HTMLInputElement).value) })"
          class="mt-1 px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Northing"
        />
      </div>
      <div class="flex flex-col">
        <label class="text-sm font-medium text-gray-700">POB E:</label>
        <input
          type="number"
          :value="pobCoordinates.y"
          @input="e => onUpdate({ ...pobCoordinates, y: Number((e.target as HTMLInputElement).value) })"
          class="mt-1 px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Easting"
        />
      </div>
    </div>
  </div>
</template>