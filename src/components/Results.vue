<script setup lang="ts">
defineProps<{
  precision: number;
  errorClosure: number;
}>();
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm p-4">
    <h2 class="text-lg font-semibold mb-3">Results</h2>
    
    <div class="space-y-2">
      <div class="flex justify-between items-center">
        <span class="text-sm text-gray-600">Precision:</span>
        <span class="font-medium">1:{{ precision.toFixed(2) }}</span>
      </div>
      
      <div class="flex justify-between items-center">
        <span class="text-sm text-gray-600">Error of Closure:</span>
        <span class="font-medium">{{ errorClosure.toFixed(2) }} ft</span>
      </div>
    </div>
  </div>
</template>