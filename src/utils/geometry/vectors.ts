import type { Point, Vector } from './types';

export function createVector(p1: Point, p2: Point): Vector {
  return {
    x: p2.x - p1.x,
    y: p2.y - p1.y
  };
}

export function normalize(v: Vector): Vector {
  const magnitude = Math.sqrt(v.x * v.x + v.y * v.y);
  return {
    x: v.x / magnitude,
    y: v.y / magnitude
  };
}

export function rotate90(v: Vector, clockwise: boolean): Vector {
  return clockwise ? 
    { x: v.y, y: -v.x } : 
    { x: -v.y, y: v.x };
}

export function scale(v: Vector, scalar: number): Vector {
  return {
    x: v.x * scalar,
    y: v.y * scalar
  };
}