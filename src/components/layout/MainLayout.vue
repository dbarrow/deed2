<script setup lang="ts">
import { ref } from 'vue';
import ProjectSidebar from './ProjectSidebar.vue';
import DeedPanel from './DeedPanel.vue';
import MapPanel from './MapPanel.vue';
import { useMapRendering } from '../../features/map/composables/useMapRendering';
import { useDeedMapConnection } from '../../features/projects/composables';

const { 
  pobCoordinates, 
  deedCalls
} = useDeedMapConnection();

const { 
  lineStyle, 
  pointStyle, 
  labelStyle, 
  layerVisibility,
  toggleLayer,
  updateLineStyle,
  updatePointStyle,
  updateLabelStyle,
  initMap
} = useMapRendering(pobCoordinates, deedCalls);

function handleMapContainer(el: HTMLElement | null) {
  if (el) {
    initMap(el);
  }
}
</script>

<template>
  <div class="flex h-screen overflow-hidden">
    <ProjectSidebar />
    <DeedPanel />
    <MapPanel 
      :line-style="lineStyle"
      :point-style="pointStyle"
      :label-style="labelStyle"
      :layer-visibility="layerVisibility"
      @update-map-container="handleMapContainer"
      @update-line-style="updateLineStyle"
      @update-point-style="updatePointStyle"
      @update-label-style="updateLabelStyle"
      @toggle-layer="toggleLayer"
    />
  </div>
</template>