<template>
  <div class="w-3/5 relative h-full">
    <div 
      ref="mapContainerRef" 
      class="absolute inset-0"
    ></div>
    <LayerControl
      class="absolute top-4 right-4 z-[1000] bg-white rounded-lg shadow-md"
      :line-style="lineStyle"
      :point-style="pointStyle"
      :label-style="labelStyle"
      :layer-visibility="layerVisibility"
      @update-line-style="emit('updateLineStyle', $event)"
      @update-point-style="emit('updatePointStyle', $event)"
      @update-label-style="emit('updateLabelStyle', $event)"
      @toggle-layer="emit('toggleLayer', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import LayerControl from '../LayerControl.vue';
import type { LayerStyle } from '../../features/map/composables/useMapStyles';

const mapContainerRef = ref<HTMLElement | null>(null);

defineProps<{
  lineStyle: LayerStyle;
  pointStyle: LayerStyle;
  labelStyle: LayerStyle;
  layerVisibility: Record<string, boolean>;
}>();

const emit = defineEmits<{
  (e: 'updateMapContainer', el: HTMLElement | null): void;
  (e: 'updateLineStyle', style: Partial<LayerStyle>): void;
  (e: 'updatePointStyle', style: Partial<LayerStyle>): void;
  (e: 'updateLabelStyle', style: Partial<LayerStyle>): void;
  (e: 'toggleLayer', layer: string, visible: boolean): void;
}>();

onMounted(() => {
  emit('updateMapContainer', mapContainerRef.value);
});
</script>