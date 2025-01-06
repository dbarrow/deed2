import { describe, it, expect } from 'vitest';
import { createTangentArc, generateArcPoints, calculateArcLength, calculateChordLength } from '../curves';

describe('curves', () => {
  describe('createTangentArc', () => {
    it('should create clockwise arc correctly', () => {
      const arc = createTangentArc(
        { x: 0, y: 0 },
        Math.PI / 2, // 90 degrees
        100,
        157.08,
        true
      );

      expect(arc.radius).toBe(100);
      expect(arc.center.x).toBeCloseTo(100);
      expect(arc.center.y).toBeCloseTo(0);
      expect(arc.isClockwise).toBe(true);
    });

    it('should create counterclockwise arc correctly', () => {
      const arc = createTangentArc(
        { x: 0, y: 0 },
        Math.PI / 2,
        100,
        157.08,
        false
      );

      expect(arc.radius).toBe(100);
      expect(arc.center.x).toBeCloseTo(-100);
      expect(arc.center.y).toBeCloseTo(0);
      expect(arc.isClockwise).toBe(false);
    });
  });

  // ... rest of the tests remain the same
});