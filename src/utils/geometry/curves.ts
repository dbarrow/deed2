import type { Point, Arc } from './types';

export function createTangentArc(
  startPoint: Point,
  tangentAngle: number, // in radians
  radius: number,
  arcLength: number,
  isClockwise: boolean
): Arc {
  // Calculate center point perpendicular to tangent line
  const centerAngle = tangentAngle + (isClockwise ? -Math.PI/2 : Math.PI/2);
  
  const center = {
    x: startPoint.x + radius * Math.cos(centerAngle),
    y: startPoint.y + radius * Math.sin(centerAngle)
  };

  // Calculate start angle from center to start point
  const startAngle = Math.atan2(startPoint.y - center.y, startPoint.x - center.x);
  
  // Calculate sweep angle based on arc length
  const sweepAngle = arcLength / radius;
  
  // Calculate end angle based on direction
  const endAngle = isClockwise ? 
    startAngle - sweepAngle : 
    startAngle + sweepAngle;

  return {
    center,
    radius,
    startAngle,
    endAngle,
    isClockwise
  };
}

export function generateArcPoints(arc: Arc, numPoints: number = 50): Point[] {
  const points: Point[] = [];
  const { center, radius, startAngle, endAngle, isClockwise } = arc;

  // Normalize angles to ensure proper sweep
  let start = startAngle;
  let end = endAngle;
  
  if (isClockwise && start < end) {
    end -= 2 * Math.PI;
  } else if (!isClockwise && start > end) {
    end += 2 * Math.PI;
  }

  const angleStep = (end - start) / (numPoints - 1);

  for (let i = 0; i < numPoints; i++) {
    const angle = start + (angleStep * i);
    points.push({
      x: center.x + radius * Math.cos(angle),
      y: center.y + radius * Math.sin(angle)
    });
  }

  return points;
}

export function calculateArcLength(radius: number, chordLength: number): number {
  if (!radius || !chordLength) return 0;
  const centralAngle = 2 * Math.asin(chordLength / (2 * radius));
  return radius * centralAngle;
}

export function calculateChordLength(radius: number, arcLength: number): number {
  if (!radius || !arcLength) return 0;
  const centralAngle = arcLength / radius;
  return 2 * radius * Math.sin(centralAngle / 2);
}