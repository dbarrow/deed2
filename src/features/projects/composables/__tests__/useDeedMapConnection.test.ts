import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useDeedMapConnection } from '../useDeedMapConnection';
import { useProjectState } from '../useProjectState';
import { useDeedState } from '../useDeedState';
import { 
  mockProjectState, 
  mockDeedState 
} from '../../../../test/mocks/composableMocks';
import { createMockProject, createMockDeed } from '../../../../test/mocks/projectMocks';

vi.mock('../useProjectState');
vi.mock('../useDeedState');

describe('useDeedMapConnection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useProjectState).mockReturnValue(mockProjectState());
    vi.mocked(useDeedState).mockReturnValue(mockDeedState());
  });

  it('should initialize with default values', () => {
    const { pobCoordinates, deedCalls } = useDeedMapConnection();
    expect(pobCoordinates.value).toEqual({ x: 1000, y: 1000 });
    expect(deedCalls.value).toEqual([]);
  });

  it('should update when current deed changes', () => {
    const mockDeed = createMockDeed({
      pobCoordinates: { x: 2000, y: 2000 },
      calls: [{
        type: 'line',
        bearing: '145.0000',
        distance: 100,
        unit: 'feet',
        noviceBearing: {
          direction1: 'N',
          degrees: '45',
          minutes: '0',
          seconds: '0',
          direction2: 'E'
        },
        curve: {
          radius: 0,
          length: 0,
          lengthType: 'arc',
          direction: 'clockwise'
        }
      }]
    });

    vi.mocked(useProjectState).mockReturnValue(
      mockProjectState(createMockProject(), mockDeed)
    );

    const { pobCoordinates, deedCalls } = useDeedMapConnection();
    expect(pobCoordinates.value).toEqual(mockDeed.pobCoordinates);
    expect(deedCalls.value).toEqual(mockDeed.calls);
  });
});