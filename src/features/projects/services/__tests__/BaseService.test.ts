import { describe, it, expect } from 'vitest';
import { BaseService } from '../BaseService';
import { ServiceError } from '../../errors/ServiceError';

class TestService extends BaseService {
  testValidationErrors(errors: Array<{ field: string; message: string }>) {
    return this.handleValidationErrors(errors);
  }

  testNotFound(entity: string, id: string) {
    return this.handleNotFound(entity, id);
  }

  testValidateOrThrow(errors: Array<{ field: string; message: string }>) {
    return this.validateOrThrow(errors);
  }
}

describe('BaseService', () => {
  const service = new TestService();

  describe('handleValidationErrors', () => {
    it('should throw ServiceError with validation errors', () => {
      const errors = [{ field: 'test', message: 'Test error' }];
      
      expect(() => service.testValidationErrors(errors))
        .toThrow(ServiceError);
    });
  });

  describe('handleNotFound', () => {
    it('should throw ServiceError with not found details', () => {
      expect(() => service.testNotFound('Test', '123'))
        .toThrow(ServiceError);
    });
  });

  describe('validateOrThrow', () => {
    it('should not throw when no errors', () => {
      expect(() => service.testValidateOrThrow([])).not.toThrow();
    });

    it('should throw when errors exist', () => {
      const errors = [{ field: 'test', message: 'Test error' }];
      expect(() => service.testValidateOrThrow(errors)).toThrow(ServiceError);
    });
  });
});