import { ref, computed } from 'vue';
import type { Deed } from '../types';

// Separate state store per project
const deedsByProject = ref<Record<string, Deed[]>>({});

export function useDeedState(projectId: string) {
  // Initialize project's deed array if it doesn't exist
  if (!deedsByProject.value[projectId]) {
    deedsByProject.value[projectId] = [];
  }

  const deeds = computed(() => deedsByProject.value[projectId] || []);

  function addDeed(deed: Omit<Deed, 'id' | 'createdAt' | 'updatedAt'>) {
    const newDeed: Deed = {
      ...deed,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    deedsByProject.value[projectId] = [...deedsByProject.value[projectId], newDeed];
    return newDeed;
  }

  function updateDeed(deedId: string, updates: Partial<Omit<Deed, 'id' | 'projectId' | 'createdAt' | 'updatedAt'>>) {
    const index = deeds.value.findIndex(d => d.id === deedId);
    if (index === -1) return null;

    const updatedDeed = {
      ...deeds.value[index],
      ...updates,
      updatedAt: new Date()
    };

    deedsByProject.value[projectId] = [
      ...deeds.value.slice(0, index),
      updatedDeed,
      ...deeds.value.slice(index + 1)
    ];

    return updatedDeed;
  }

  function deleteDeed(deedId: string) {
    deedsByProject.value[projectId] = deeds.value.filter(d => d.id !== deedId);
    return true;
  }

  function getDeed(deedId: string) {
    return deeds.value.find(d => d.id === deedId) || null;
  }

  // Add a reset function for testing
  function reset() {
    deedsByProject.value[projectId] = [];
  }

  return {
    deeds,
    addDeed,
    updateDeed,
    deleteDeed,
    getDeed,
    reset
  };
}