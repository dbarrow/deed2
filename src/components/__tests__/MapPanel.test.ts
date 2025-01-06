import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import MapPanel from '../layout/MapPanel.vue';

describe('MapPanel', () => {
  const defaultProps = {
    lineStyle: { color: '#000', weight: 1, opacity: 1 },
    pointStyle: { color: '#000', weight: 1, opacity: 1, size: 1 },
    labelStyle: { color: '#000', weight: 1, opacity: 1, fontSize: 12 },
    layerVisibility: { lines: true, points: true, labels: true }
  };

  it('should emit map container on mount', () => {
    const wrapper = mount(MapPanel, {
      props: defaultProps
    });

    expect(wrapper.emitted('updateMapContainer')).toBeTruthy();
  });

  it('should emit style updates', async () => {
    const wrapper = mount(MapPanel, {
      props: defaultProps
    });

    await wrapper.vm.$emit('updateLineStyle', { color: '#f00' });
    expect(wrapper.emitted('updateLineStyle')?.[0][0]).toEqual({ color: '#f00' });

    await wrapper.vm.$emit('updatePointStyle', { size: 2 });
    expect(wrapper.emitted('updatePointStyle')?.[0][0]).toEqual({ size: 2 });

    await wrapper.vm.$emit('updateLabelStyle', { fontSize: 14 });
    expect(wrapper.emitted('updateLabelStyle')?.[0][0]).toEqual({ fontSize: 14 });
  });

  it('should emit layer visibility updates', async () => {
    const wrapper = mount(MapPanel, {
      props: defaultProps
    });

    await wrapper.vm.$emit('toggleLayer', 'lines', false);
    expect(wrapper.emitted('toggleLayer')?.[0]).toEqual(['lines', false]);
  });
});