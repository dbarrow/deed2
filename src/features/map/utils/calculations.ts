import type { Point } from '../../../types';

export function calculateNextPoint(currentPoint: Point, bearingDegrees: number, distance: number): Point {
  const bearingRad = (bearingDegrees * Math.PI) / 180;
  const dx = distance * Math.sin(bearingRad);
  const dy = distance * Math.cos(bearingRad);
  
  return {
    x: currentPoint.x + dx,
    y: currentPoint.y + dy
  };
}