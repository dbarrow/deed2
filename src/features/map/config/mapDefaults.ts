export const MAP_DEFAULTS = {
  zoom: {
    min: -3,
    max: 3,
    initial: 0
  },
  style: {
    line: {
      color: '#2563eb',
      weight: 2,
      opacity: 1
    },
    point: {
      color: '#000000',
      weight: 1,
      opacity: 1,
      size: 0.5
    },
    label: {
      color: '#374151',
      weight: 1,
      opacity: 1,
      fontSize: 12
    }
  },
  layers: {
    lines: true,
    points: true,
    labels: true
  }
} as const;