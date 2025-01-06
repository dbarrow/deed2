import { ServiceError } from '../errors/ServiceError';
import type { ValidationError } from '../validation/projectValidation';

export abstract class BaseService {
  protected handleValidationErrors(errors: ValidationError[]): never {
    throw ServiceError.validation(errors);
  }

  protected handleNotFound(entity: string, id: string): never {
    throw ServiceError.notFound(entity, id);
  }

  protected validateOrThrow(errors: ValidationError[]): void {
    if (errors.length > 0) {
      this.handleValidationErrors(errors);
    }
  }
}