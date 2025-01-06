import { ref } from 'vue';
import { vi } from 'vitest';
import type { Project, Deed } from '../../features/projects/types';
import { createMockProject, createMockDeed } from './projectMocks';

export function mockProjectState(project?: Project | null, deed?: Deed | null) {
  return {
    currentProject: ref(project ?? null),
    currentDeed: ref(deed ?? null),
    setCurrentDeed: vi.fn()
  };
}

export function mockDeedState() {
  return {
    deeds: ref([]),
    addDeed: vi.fn(),
    updateDeed: vi.fn(),
    deleteDeed: vi.fn(),
    getDeed: vi.fn()
  };
}

export function mockDeedMapConnection() {
  return {
    pobCoordinates: ref({ x: 1000, y: 1000 }),
    deedCalls: ref([]),
    updatePobCoordinates: vi.fn(),
    addCall: vi.fn(),
    deleteCall: vi.fn()
  };
}