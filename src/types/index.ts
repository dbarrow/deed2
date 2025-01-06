export interface Point {
  x: number;
  y: number;
}

export interface DeedCall {
  type: 'line' | 'curve';
  bearing: string;
  distance: number;
  unit: 'feet' | 'meters' | 'chains' | 'rods';
  noviceBearing: {
    direction1: 'N' | 'S';
    degrees: string | number;
    minutes: string | number;
    seconds: string | number;
    direction2: 'E' | 'W';
  };
  curve: {
    radius: number;
    length: number;
    lengthType: 'arc' | 'chord';
    direction: 'clockwise' | 'counterclockwise';
  };
}