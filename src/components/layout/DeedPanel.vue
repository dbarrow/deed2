<template>
  <div class="w-2/5 flex flex-col bg-white">
    <DeedTabs
      :deeds="projectDeeds"
      :current-deed="currentDeed"
      @select-deed="setCurrentDeed"
      @close-deed="handleCloseDeed"
      @add-deed="handleAddDeed"
      @update-deed="handleUpdateDeed"
    />
    
    <div v-if="currentDeed" class="flex-1 p-4 overflow-y-auto">
      <PointOfBeginning
        :pob-coordinates="pobCoordinates"
        @update="updatePobCoordinates"
      />

      <DataEntryCard
        @add-call="addCall"
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
            @delete="deleteCall(index)"
          />
        </div>

        <CallListFooter
          :precision="precision"
          :error-closure="errorClosure"
        />
      </div>
    </div>
    <div v-else class="flex-1 flex items-center justify-center text-gray-500">
      <p>Select a deed or create a new one to get started</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import DeedTabs from '../deeds/DeedTabs.vue';
import PointOfBeginning from '../PointOfBeginning.vue';
import DataEntryCard from '../DataEntryCard.vue';
import CallCard from '../CallCard.vue';
import CallListFooter from '../CallListFooter.vue';
import { useProjectState, useDeedState, useDeedMapConnection } from '../../features/projects/composables';
import { useCoordinates } from '../../composables/useCoordinates';
import type { Deed } from '../../features/projects/types';

const { currentProject, currentDeed, setCurrentDeed } = useProjectState();
const { 
  pobCoordinates, 
  deedCalls,
  updatePobCoordinates,
  addCall,
  deleteCall 
} = useDeedMapConnection();

const { calculatedCoordinates, precision, errorClosure } = useCoordinates(pobCoordinates, deedCalls);

const projectDeeds = computed(() => {
  if (!currentProject.value) return [];
  const { deeds } = useDeedState(currentProject.value.id);
  return deeds.value;
});

function handleAddDeed() {
  if (!currentProject.value) return;
  
  const { addDeed } = useDeedState(currentProject.value.id);
  const newDeed = addDeed({
    projectId: currentProject.value.id,
    name: `Deed ${projectDeeds.value.length + 1}`,
    description: '',
    pobCoordinates: { x: 1000, y: 1000 },
    calls: []
  });
  
  setCurrentDeed(newDeed.id);
}

function handleCloseDeed(deedId: string) {
  if (!currentProject.value) return;
  const { deleteDeed } = useDeedState(currentProject.value.id);
  deleteDeed(deedId);
  setCurrentDeed(null);
}

function handleUpdateDeed(deed: Deed) {
  if (!currentProject.value) return;
  const { updateDeed } = useDeedState(currentProject.value.id);
  updateDeed(deed.id, deed);
}
</script>
```