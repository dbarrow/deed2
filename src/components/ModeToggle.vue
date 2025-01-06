<script setup lang="ts">
defineProps<{
  mode: 'pro' | 'novice';
}>();

const emit = defineEmits<{
  (e: 'update', mode: 'pro' | 'novice'): void;
}>();
</script>

<template>
  <div class="mode-toggle mb-4">
    <div class="flex items-center justify-center bg-gray-100 p-2 rounded-lg">
      <input type="radio" 
             id="pro-mode"
             :checked="mode === 'pro'"
             @change="emit('update', 'pro')"
             class="hidden" />
      <label for="pro-mode" 
             class="cursor-pointer px-4 py-2 rounded-md"
             :class="{ 'bg-blue-500 text-white': mode === 'pro' }">
        Pro Mode
      </label>

      <input type="radio" 
             id="novice-mode"
             :checked="mode === 'novice'"
             @change="emit('update', 'novice')"
             class="hidden" />
      <label for="novice-mode"
             class="cursor-pointer px-4 py-2 rounded-md"
             :class="{ 'bg-blue-500 text-white': mode === 'novice' }">
        Novice Mode
      </label>
    </div>
  </div>
</template>

<style scoped>
.mode-toggle label {
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-radius: 0.375rem;
  transition: all 0.2s;
}

.mode-toggle input {
  position: absolute;
  opacity: 0;
}
</style>