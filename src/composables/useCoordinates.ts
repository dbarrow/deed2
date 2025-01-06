import { computed, type Ref } from 'vue';
import type { DeedCall } from '../types';
import type { Point } from '../utils/geometry/types';
import { parseBearing } from '../utils/bearingCalculations';
import { convertUnits } from '../utils/unitConversion';
import { calculateNextPoint } from '../utils/calculations';
import { createTangentArc, generateArcPoints } from '../utils/geometry/curves';

export function useCoordinates(pobCoordinates: Ref<Point>, deedCalls: Ref<DeedCall[]>) {
  const calculatedCoordinates = computed(() => {
    const coordinates: Point[] = [];
    let currentPoint = { ...pobCoordinates.value };
    let lastBearing = 0;

    deedCalls.value.forEach(call => {
      if (call.type === 'line' && call.bearing && call.distance) {
        const decimalDegrees = parseBearing(call.bearing);
        const distance = convertUnits(parseFloat(call.distance.toString()), call.unit);
        currentPoint = calculateNextPoint(currentPoint, decimalDegrees, distance);
        lastBearing = decimalDegrees;
        coordinates.push({ ...currentPoint });
      } else if (call.type === 'curve' && call.curve.radius && call.curve.length) {
        const radius = convertUnits(call.curve.radius, call.unit);
        const length = convertUnits(call.curve.length, call.unit);
        
        const arc = createTangentArc(
          currentPoint,
          (lastBearing * Math.PI) / 180,
          radius,
          length,
          call.curve.direction === 'clockwise'
        );

        const curvePoints = generateArcPoints(arc);
        const lastPoint = curvePoints[curvePoints.length - 1];
        currentPoint = lastPoint;
        coordinates.push({ ...currentPoint });

        const endAngle = call.curve.direction === 'clockwise' ? 
          arc.endAngle - Math.PI/2 :
          arc.endAngle + Math.PI/2;
        lastBearing = (endAngle * 180) / Math.PI;
      }
    });

    return coordinates;
  });

  const precision = computed(() => {
    const coordinates = calculatedCoordinates.value;
    if (coordinates.length < 2) return 0;

    const totalDistance = coordinates.reduce((sum, coord, i) => {
      if (i === 0) return sum;
      const prevCoord = coordinates[i - 1];
      const dx = coord.x - prevCoord.x;
      const dy = coord.y - prevCoord.y;
      return sum + Math.sqrt(dx * dx + dy * dy);
    }, 0);

    return totalDistance / errorClosure.value || 0;
  });

  const errorClosure = computed(() => {
    const coordinates = calculatedCoordinates.value;
    if (coordinates.length < 1) return 0;

    const lastPoint = coordinates[coordinates.length - 1];
    const dx = lastPoint.x - pobCoordinates.value.x;
    const dy = lastPoint.y - pobCoordinates.value.y;
    return Math.sqrt(dx * dx + dy * dy);
  });

  return {
    calculatedCoordinates,
    precision,
    errorClosure
  };
}