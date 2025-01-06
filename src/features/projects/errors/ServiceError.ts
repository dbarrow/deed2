export class ServiceError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'ServiceError';
  }

  static notFound(entity: string, id: string): ServiceError {
    return new ServiceError(
      `${entity} with id ${id} not found`,
      'NOT_FOUND',
      { entity, id }
    );
  }

  static validation(errors: Array<{ field: string; message: string }>): ServiceError {
    return new ServiceError(
      'Validation failed',
      'VALIDATION_ERROR',
      { errors }
    );
  }
}