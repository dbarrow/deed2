import { describe, it, expect, beforeEach } from 'vitest';
import { useDeedState } from '../useDeedState';

describe('useDeedState', () => {
  const projectId = 'test-project';
  const testDeed = {
    projectId,
    name: 'Test Deed',
    description: '',
    pobCoordinates: { x: 1000, y: 1000 },
    calls: []
  };

  beforeEach(() => {
    // Reset the state before each test
    const { reset } = useDeedState(projectId);
    reset();
  });

  it('should add a new deed', () => {
    const { addDeed, deeds } = useDeedState(projectId);
    const newDeed = addDeed(testDeed);

    expect(deeds.value).toHaveLength(1);
    expect(newDeed.id).toBeDefined();
    expect(newDeed.name).toBe(testDeed.name);
  });

  it('should update an existing deed', () => {
    const { addDeed, updateDeed, deeds } = useDeedState(projectId);
    const deed = addDeed(testDeed);
    
    const updates = { name: 'Updated Deed' };
    const updatedDeed = updateDeed(deed.id, updates);

    expect(updatedDeed).toBeDefined();
    expect(deeds.value[0].name).toBe('Updated Deed');
  });

  it('should delete a deed', () => {
    const { addDeed, deleteDeed, deeds } = useDeedState(projectId);
    const deed = addDeed(testDeed);
    
    expect(deeds.value).toHaveLength(1);
    deleteDeed(deed.id);
    expect(deeds.value).toHaveLength(0);
  });

  it('should get a deed by id', () => {
    const { addDeed, getDeed } = useDeedState(projectId);
    const deed = addDeed(testDeed);
    
    const retrieved = getDeed(deed.id);
    expect(retrieved).toBeDefined();
    expect(retrieved?.id).toBe(deed.id);
  });
});