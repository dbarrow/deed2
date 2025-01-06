```vue
<script setup lang="ts">
defineProps<{
  precision: number;
  errorClosure: number;
}>();
</script>

<template>
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
</template>
```