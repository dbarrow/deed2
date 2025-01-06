import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import DeedPanel from '../layout/DeedPanel.vue';
import { useProjectState } from '../../features/projects/composables/useProjectState';
import { useDeedState } from '../../features/projects/composables/useDeedState';
import { useDeedMapConnection } from '../../features/projects/composables';
import { 
  mockProjectState, 
  mockDeedState, 
  mockDeedMapConnection 
} from '../../test/mocks/composableMocks';
import { createMockProject, createMockDeed } from '../../test/mocks/projectMocks';

vi.mock('../../features/projects/composables/useProjectState');
vi.mock('../../features/projects/composables/useDeedState');
vi.mock('../../features/projects/composables/useDeedMapConnection');

describe('DeedPanel', () => {
  beforeEach(() => {
    vi.mocked(useProjectState).mockReturnValue(mockProjectState(createMockProject()));
    vi.mocked(useDeedState).mockReturnValue(mockDeedState());
    vi.mocked(useDeedMapConnection).mockReturnValue(mockDeedMapConnection());
  });

  it('should render empty state when no deed is selected', () => {
    const wrapper = mount(DeedPanel);
    expect(wrapper.text()).toContain('Select a deed or create a new one');
  });

  it('should render deed content when deed is selected', () => {
    const mockDeed = createMockDeed();
    vi.mocked(useProjectState).mockReturnValue(
      mockProjectState(createMockProject(), mockDeed)
    );

    const wrapper = mount(DeedPanel);
    expect(wrapper.find('h2').exists()).toBe(true);
  });
});