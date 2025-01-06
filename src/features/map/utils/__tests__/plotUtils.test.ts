import { describe, it, expect } from 'vitest';
import { calculatePlotPoints } from '../plotUtils';
import type { DeedCall } from '../../../../types';

describe('plotUtils', () => {
  it('should calculate plot points for line calls', () => {
    const pobCoordinates = { x: 0, y: 0 };
    const deedCalls: DeedCall[] = [{
      type: 'line',
      bearing: '145.0000',
      distance: 100,
      unit: 'feet',
      noviceBearing: {
        direction1: 'N',
        degrees: '45',
        minutes: '0',
        seconds: '0',
        direction2: 'E'
      },
      curve: {
        radius: 0,
        length: 0,
        lengthType: 'arc',
        direction: 'clockwise'
      }
    }];

    const points = calculatePlotPoints(pobCoordinates, deedCalls);
    expect(points).toHaveLength(2);
    expect(points[0].coordinates).toEqual([0, 0]);
    expect(points[1].coordinates[0]).toBeCloseTo(70.71);
    expect(points[1].coordinates[1]).toBeCloseTo(70.71);
  });
});