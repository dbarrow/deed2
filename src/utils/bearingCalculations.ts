export function parseBearing(bearing: string): number {
  if (!bearing) return 0;
  
  const quadrant = parseInt(bearing.charAt(0));
  const bearingParts = bearing.substring(1).split(".");
  const degrees = parseInt(bearingParts[0]);
  const minutes = bearingParts[1] ? parseInt(bearingParts[1].substring(0, 2)) : 0;
  const seconds = bearingParts[1] ? parseInt(bearingParts[1].substring(2)) : 0;
  
  let decimalDegrees = degrees + minutes/60 + seconds/3600;
  switch (quadrant) {
    case 1: break;
    case 2: decimalDegrees = 180 - decimalDegrees; break;
    case 3: decimalDegrees = 180 + decimalDegrees; break;
    case 4: decimalDegrees = 360 - decimalDegrees; break;
  }
  
  return decimalDegrees;
}

export function formatBearing(bearing: string): string {
  if (!bearing) return "-";
  
  const quadrant = parseInt(bearing.charAt(0));
  const bearingParts = bearing.substring(1).split(".");
  const degrees = parseInt(bearingParts[0]);
  const minutes = bearingParts[1] ? parseInt(bearingParts[1].substring(0, 2) || "00") : 0;
  const seconds = bearingParts[1] ? parseInt(bearingParts[1].substring(2) || "00") : 0;

  const direction = quadrant === 1 || quadrant === 4 ? "N" : "S";
  const cardinalDirection = quadrant === 1 || quadrant === 2 ? "E" : "W";

  return `${direction} ${degrees}° ${minutes}' ${seconds}" ${cardinalDirection}`;
}