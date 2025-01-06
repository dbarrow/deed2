import { vi } from 'vitest';
import type { Point } from '../../types';
import type { LayerStyle } from '../../features/map/composables/useMapStyles';

export const createMapServiceMock = () => ({
  initialize: vi.fn(),
  cleanup: vi.fn(),
  clearLayers: vi.fn(),
  addPoint: vi.fn((point: Point, style?: LayerStyle) => {}),
  addLine: vi.fn((start: Point, end: Point, style?: LayerStyle) => {}),
  addLabel: vi.fn((position: Point, text: string, style?: LayerStyle) => {}),
  updateLineStyle: vi.fn((style: LayerStyle) => {}),
  updatePointStyle: vi.fn((style: LayerStyle) => {}),
  updateLabelStyle: vi.fn((style: LayerStyle) => {}),
  zoomIn: vi.fn(),
  zoomOut: vi.fn(),
  panTo: vi.fn(),
  fitBounds: vi.fn()
});

export const mockMapService = createMapServiceMock();