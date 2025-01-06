import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import CallListFooter from '../CallListFooter.vue';

describe('CallListFooter', () => {
  it('should display precision and error closure', () => {
    const wrapper = mount(CallListFooter, {
      props: {
        precision: 1000,
        errorClosure: 5.5
      }
    });

    expect(wrapper.text()).toContain('1:1000.00');
    expect(wrapper.text()).toContain('5.50 ft');
  });
});