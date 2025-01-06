<template>
  <div class="pl-6 border-l-2 border-blue-100">
    <h4 class="text-xs font-medium text-gray-500 mb-2">{{ label }}</h4>
    
    <!-- Color Presets -->
    <div class="flex flex-wrap gap-1 mb-2">
      <button v-for="color in colorPresets"
              :key="color"
              @click="$emit('update', { color })"
              class="w-6 h-6 rounded-full border border-gray-200 hover:scale-110 transition-transform"
              :class="{ 'ring-2 ring-offset-2 ring-blue-500': styleConfig.color === color }"
              :style="{ backgroundColor: color }">
      </button>
    </div>
    
    <!-- Custom Color -->
    <div class="flex items-center space-x-2 mb-2">
      <input type="color"
             :value="styleConfig.color"
             @input="e => $emit('update', { color: (e.target as HTMLInputElement).value })"
             class="w-8 h-8 rounded cursor-pointer" />
      <span class="text-xs">Custom Color</span>
    </div>
    
    <!-- Size/Width Control -->
    <div class="flex items-center space-x-2 mb-2">
      <template v-if="type === 'point'">
        <input type="range"
               :value="styleConfig.size"
               @input="e => $emit('update', { size: Number((e.target as HTMLInputElement).value) })"
               min="0.1"
               max="3"
               step="0.1"
               class="w-24" />
        <span class="text-xs text-gray-500">Size: {{ styleConfig.size }}</span>
      </template>
      <template v-else-if="type === 'line'">
        <input type="range"
               :value="styleConfig.weight"
               @input="e => $emit('update', { weight: Number((e.target as HTMLInputElement).value) })"
               min="1"
               max="5"
               step="0.5"
               class="w-24" />
        <span class="text-xs text-gray-500">Width: {{ styleConfig.weight }}px</span>
      </template>
    </div>

    <!-- Font Size Control for Labels -->
    <div v-if="type === 'label'" class="flex items-center space-x-2">
      <input type="range"
             :value="styleConfig.fontSize"
             @input="e => $emit('update', { fontSize: Number((e.target as HTMLInputElement).value) })"
             min="8"
             max="24"
             step="1"
             class="w-24" />
      <span class="text-xs text-gray-500">Font Size: {{ styleConfig.fontSize }}px</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LayerStyle } from '../composables/useMapStyles';

defineProps<{
  label: string;
  styleConfig: LayerStyle;
  type?: 'line' | 'point' | 'label';
}>();

defineEmits<{
  (e: 'update', style: Partial<LayerStyle>): void;
}>();

const colorPresets = [
  '#2563eb', // Blue
  '#dc2626', // Red
  '#16a34a', // Green
  '#ca8a04', // Yellow
  '#9333ea', // Purple
  '#0891b2', // Cyan
  '#ea580c', // Orange
  '#4b5563'  // Gray
];
</script>