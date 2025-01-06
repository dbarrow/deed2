import { describe, it, expect, vi, beforeEach } from 'vitest';
import { projectEventEmitter } from '../projectEvents';
import { nextTick, watch } from 'vue';

describe('projectEventEmitter', () => {
  const mockProject = {
    id: 'test-id',
    name: 'Test Project',
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01')
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should emit project events', async () => {
    const event = { type: 'created' as const, project: mockProject };
    projectEventEmitter.emit(event);
    
    await nextTick();
    expect(projectEventEmitter.getEvents()).toContainEqual(event);
  });

  it('should limit event history to 100 events', async () => {
    // Add 101 events
    for (let i = 0; i < 101; i++) {
      projectEventEmitter.emit({
        type: 'created',
        project: { ...mockProject, id: `test-${i}` }
      });
    }

    await nextTick();
    const events = projectEventEmitter.getEvents();
    expect(events).toHaveLength(100);
    expect(events[0].project.id).toBe('test-1');
  });

  it('should notify subscribers of new events', async () => {
    const callback = vi.fn();
    watch(projectEventEmitter.getEvents(), callback);

    const event = { type: 'updated' as const, project: mockProject };
    projectEventEmitter.emit(event);

    await nextTick();
    expect(callback).toHaveBeenCalledWith([event]);
  });
});