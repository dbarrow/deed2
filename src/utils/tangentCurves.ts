import type { DeedCall, Point } from '../types';

export function calculateTangentCurve(
  startPoint: Point,
  lastBearing: number,
  curve: DeedCall['curve'],
  unit: DeedCall['unit']
): { 
  centerPoint: Point;
  startAngle: number;
  endAngle: number;
} {
  // Convert radius to feet for consistency
  let radius = curve.radius;
  switch (unit) {
    case 'meters': radius *= 3.28084; break;
    case 'chains': radius *= 66; break;
    case 'rods': radius *= 16.5; break;
  }

  // For a tangent curve, the center point must be perpendicular to the tangent line
  // at a distance of the radius. The direction determines which side of the line.
  const perpAngle = lastBearing + (curve.direction === 'clockwise' ? -90 : 90);
  const perpRad = (perpAngle * Math.PI) / 180;
  
  // Calculate center point perpendicular to the tangent line
  const centerPoint = {
    x: startPoint.x + radius * Math.cos(perpRad),
    y: startPoint.y + radius * Math.sin(perpRad)
  };

  // Convert arc length to feet
  let arcLength = curve.length;
  switch (unit) {
    case 'meters': arcLength *= 3.28084; break;
    case 'chains': arcLength *= 66; break;
    case 'rods': arcLength *= 16.5; break;
  }

  // Calculate central angle based on length type
  const centralAngle = curve.lengthType === 'chord' 
    ? 2 * Math.asin(arcLength / (2 * radius))
    : arcLength / radius;

  // Convert to degrees
  const sweepAngle = (centralAngle * 180) / Math.PI;
  
  // The start angle is perpendicular to the radius at the start point
  const startAngle = lastBearing;
  
  // Calculate end angle based on direction of curve
  const endAngle = curve.direction === 'clockwise'
    ? ((startAngle - sweepAngle) % 360 + 360) % 360
    : ((startAngle + sweepAngle) % 360 + 360) % 360;

  return {
    centerPoint,
    startAngle,
    endAngle
  };
}