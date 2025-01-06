import { config } from '@vue/test-utils';

export function setupVueEnvironment() {
  // Configure Vue Test Utils global settings
  config.global.stubs = {
    transition: false,
    'transition-group': false
  };

  // Add any additional Vue-specific test environment setup here
}