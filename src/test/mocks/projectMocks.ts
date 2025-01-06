import { ref } from 'vue';
import type { Project, Deed } from '../../features/projects/types';

export function createMockProject(overrides: Partial<Project> = {}): Project {
  return {
    id: 'test-project',
    name: 'Test Project',
    description: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides
  };
}

export function createMockDeed(overrides: Partial<Deed> = {}): Deed {
  return {
    id: 'test-deed',
    projectId: 'test-project',
    name: 'Test Deed',
    description: '',
    pobCoordinates: { x: 1000, y: 1000 },
    calls: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides
  };
}