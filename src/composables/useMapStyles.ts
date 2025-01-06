import { ref } from 'vue';

export interface LayerStyle {
  color: string;
  weight: number;
  opacity: number;
  size?: number;     // For point size
  fontSize?: number; // For label font size
}

const DEFAULT_COLORS = {
  line: '#2563eb',
  point: '#000000',
  label: '#374151'
} as const;

export function useMapStyles() {
  const lineStyle = ref<LayerStyle>({
    color: DEFAULT_COLORS.line,
    weight: 2,
    opacity: 1
  });

  const pointStyle = ref<LayerStyle>({
    color: DEFAULT_COLORS.point,
    weight: 1,
    opacity: 1,
    size: 0.5
  });

  const labelStyle = ref<LayerStyle>({
    color: DEFAULT_COLORS.label,
    weight: 1,
    opacity: 1,
    fontSize: 12
  });

  return {
    lineStyle,
    pointStyle,
    labelStyle,
    DEFAULT_COLORS
  };
}