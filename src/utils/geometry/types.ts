export interface Point {
  x: number;
  y: number;
}

export interface Vector extends Point {}

export interface Arc {
  center: Point;
  radius: number;
  startAngle: number;  // in radians
  endAngle: number;    // in radians
  isClockwise: boolean;
}