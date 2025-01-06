import type { DeedCall, Point } from '../../../types';
import { parseBearing } from './bearingCalculations';
import { convertUnits } from '../../../utils/unitConversion';
import { calculateNextPoint } from './calculations';
import { createTangentArc, generateArcPoints } from '../../../utils/geometry/curves';
import { formatBearing } from './bearingCalculations';

export interface PlotPoint {
  coordinates: [number, number];
  bearing?: number;
  distance?: string;
  label?: string;
}

export function calculatePlotPoints(
  pobCoordinates: Point,
  deedCalls: DeedCall[]
): PlotPoint[] {
  const points: PlotPoint[] = [{
    coordinates: [pobCoordinates.y, pobCoordinates.x]
  }];

  let currentPoint = { ...pobCoordinates };
  let lastBearing = 0;

  deedCalls.forEach((call) => {
    if (call.type === 'line' && call.bearing && call.distance) {
      const bearing = parseBearing(call.bearing);
      const distance = convertUnits(parseFloat(call.distance.toString()), call.unit);
      
      const nextPoint = calculateNextPoint(currentPoint, bearing, distance);
      points.push({
        coordinates: [nextPoint.y, nextPoint.x],
        bearing,
        distance: `${call.distance} ${call.unit}`,
        label: formatBearing(call.bearing)
      });

      currentPoint = nextPoint;
      lastBearing = bearing;
    } else if (call.type === 'curve' && call.curve.radius && call.curve.length) {
      const radius = convertUnits(parseFloat(call.curve.radius.toString()), call.unit);
      const length = convertUnits(parseFloat(call.curve.length.toString()), call.unit);
      
      const arc = createTangentArc(
        currentPoint,
        (lastBearing * Math.PI) / 180,
        radius,
        length,
        call.curve.direction === 'clockwise'
      );

      const curvePoints = generateArcPoints(arc);
      curvePoints.forEach((point, i) => {
        if (i === 0) return;
        
        points.push({
          coordinates: [point.y, point.x]
        });
      });

      const lastPoint = curvePoints[curvePoints.length - 1];
      currentPoint = lastPoint;

      const endAngle = call.curve.direction === 'clockwise' ? 
        arc.endAngle - Math.PI/2 : 
        arc.endAngle + Math.PI/2;
      lastBearing = (endAngle * 180) / Math.PI;
    }
  });

  return points;
}