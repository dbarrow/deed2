const CONVERSION_FACTORS = {
  feet: 1,
  meters: 3.28084,
  chains: 66,
  rods: 16.5
} as const;

export type Unit = keyof typeof CONVERSION_FACTORS;

export function convertUnits(value: number, fromUnit: Unit, toUnit: Unit = 'feet'): number {
  return value * (CONVERSION_FACTORS[fromUnit] / CONVERSION_FACTORS[toUnit]);
}