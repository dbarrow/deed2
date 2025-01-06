import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useMapService } from '../useMapService';
import { mockMapService } from '../../../../test/mocks/mapService';

vi.mock('../../services/MapService', () => ({
  mapService: mockMapService
}));

describe('useMapService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize map when container is mounted', () => {
    const { container } = useMapService();
    const el = document.createElement('div');
    container.value = el;

    expect(mockMapService.initialize).toHaveBeenCalledWith(el);
  });

  it('should expose map operations', () => {
    const { container, addPoint, addLine, addLabel, clearLayers } = useMapService();
    const el = document.createElement('div');
    container.value = el;

    const point = { x: 0, y: 0 };
    addPoint(point);
    expect(mockMapService.addPoint).toHaveBeenCalledWith(point);

    const start = { x: 0, y: 0 };
    const end = { x: 100, y: 100 };
    addLine(start, end);
    expect(mockMapService.addLine).toHaveBeenCalledWith(start, end);

    const label = 'Test Label';
    addLabel(point, label);
    expect(mockMapService.addLabel).toHaveBeenCalledWith(point, label);

    clearLayers();
    expect(mockMapService.clearLayers).toHaveBeenCalled();
  });
});