import { describe, it, expect, vi, beforeEach } from 'vitest';
import { deedEventEmitter } from '../deedEvents';
import { nextTick, watch } from 'vue';

describe('deedEventEmitter', () => {
  const mockDeed = {
    id: 'test-id',
    projectId: 'project-id',
    name: 'Test Deed',
    pobCoordinates: { x: 0, y: 0 },
    calls: [],
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01')
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should emit deed events', async () => {
    const event = { 
      type: 'created' as const, 
      deed: mockDeed,
      projectId: mockDeed.projectId 
    };
    
    deedEventEmitter.emit(event);
    await nextTick();
    expect(deedEventEmitter.getEvents()).toContainEqual(event);
  });

  it('should limit event history to 100 events', async () => {
    // Add 101 events
    for (let i = 0; i < 101; i++) {
      deedEventEmitter.emit({
        type: 'created',
        deed: { ...mockDeed, id: `test-${i}` },
        projectId: mockDeed.projectId
      });
    }

    await nextTick();
    const events = deedEventEmitter.getEvents();
    expect(events).toHaveLength(100);
    expect(events[0].deed.id).toBe('test-1');
  });

  it('should notify subscribers of new events', async () => {
    const callback = vi.fn();
    watch(deedEventEmitter.getEvents(), callback);

    const event = { 
      type: 'updated' as const, 
      deed: mockDeed,
      projectId: mockDeed.projectId 
    };
    
    deedEventEmitter.emit(event);
    await nextTick();
    expect(callback).toHaveBeenCalledWith([event]);
  });
});