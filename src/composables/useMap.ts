import { ref, watch, type Ref } from 'vue';
import L from 'leaflet';
import type { DeedCall, Point } from '../types';
import { useMapLayers } from './useMapLayers';
import { useMapStyles } from './useMapStyles';
import { parseBearing } from '../utils/bearingCalculations';
import { convertUnits } from '../utils/unitConversion';
import { createTangentArc, generateArcPoints } from '../utils/geometry/curves';

export function useMap(
  getMapContainer: () => HTMLElement | null,
  pobCoordinates: Ref<Point>,
  deedCalls: Ref<DeedCall[]>
) {
  const map = ref<L.Map | null>(null);
  const { lineStyle, pointStyle, labelStyle } = useMapStyles();
  
  const { 
    layers,
    layerVisibility,
    initLayers,
    clearLayers,
    toggleLayer,
    addLine,
    addPoint,
    addLineLabel
  } = useMapLayers(map, lineStyle, pointStyle, labelStyle);

  function initMap() {
    const container = getMapContainer();
    if (!container || map.value) return;
    
    map.value = L.map(container, {
      crs: L.CRS.Simple,
      minZoom: -3,
      zoomControl: false
    });
    
    L.control.zoom({
      position: 'topleft'
    }).addTo(map.value);

    map.value.setView([0, 0], 0);
    initLayers();
  }

  function updatePlot() {
    if (!map.value) {
      initMap();
    }

    if (!map.value) return;

    clearLayers();

    // Plot points and lines
    const points: [number, number][] = [[pobCoordinates.value.y, pobCoordinates.value.x]];
    let currentPoint = { ...pobCoordinates.value };
    let lastBearing = 0;

    // Add POB point
    addPoint(points[0]);

    deedCalls.value.forEach((call, index) => {
      if (call.type === 'line' && call.bearing && call.distance) {
        const decimalDegrees = parseBearing(call.bearing);
        const distance = convertUnits(parseFloat(call.distance.toString()), call.unit);
        
        // Calculate next point
        const nextPoint = calculateNextPoint(currentPoint, decimalDegrees, distance);
        points.push([nextPoint.y, nextPoint.x]);
        
        // Add line and point
        addLine(points[index], points[index + 1]);
        addPoint(points[index + 1]);
        
        // Add label
        addLineLabel(
          currentPoint,
          nextPoint,
          `${call.distance} ${call.unit}`,
          call.bearing
        );

        currentPoint = nextPoint;
        lastBearing = decimalDegrees;
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
        curvePoints.forEach((point, i) => {
          if (i === 0) return;
          
          const leafletPoint: [number, number] = [point.y, point.x];
          points.push(leafletPoint);
          
          if (i === curvePoints.length - 1) {
            addPoint(leafletPoint);
          }
          
          const prevPoint = curvePoints[i - 1];
          addLine(
            [prevPoint.y, prevPoint.x],
            leafletPoint
          );
        });

        // Update current point and bearing
        const lastPoint = curvePoints[curvePoints.length - 1];
        currentPoint = lastPoint;

        // Calculate new bearing tangent to curve at end point
        const endAngle = call.curve.direction === 'clockwise' ? 
          arc.endAngle - Math.PI/2 : 
          arc.endAngle + Math.PI/2;
        lastBearing = (endAngle * 180) / Math.PI;
      }
    });

    // Fit bounds if we have points
    if (points.length >= 2) {
      map.value.fitBounds(L.latLngBounds(points), { padding: [50, 50] });
    }
  }

  // Watch for changes and update plot
  watch([pobCoordinates, deedCalls], () => {
    updatePlot();
  }, { deep: true });

  return {
    map,
    lineStyle,
    pointStyle,
    labelStyle,
    layerVisibility,
    updatePlot,
    toggleLayer,
    updateLineStyle: (style: Partial<typeof lineStyle.value>) => {
      lineStyle.value = { ...lineStyle.value, ...style };
    },
    updatePointStyle: (style: Partial<typeof pointStyle.value>) => {
      pointStyle.value = { ...pointStyle.value, ...style };
    },
    updateLabelStyle: (style: Partial<typeof labelStyle.value>) => {
      labelStyle.value = { ...labelStyle.value, ...style };
    }
  };
}

function calculateNextPoint(currentPoint: Point, bearingDegrees: number, distance: number): Point {
  const bearingRad = (bearingDegrees * Math.PI) / 180;
  const dx = distance * Math.sin(bearingRad);
  const dy = distance * Math.cos(bearingRad);
  
  return {
    x: currentPoint.x + dx,
    y: currentPoint.y + dy
  };
}