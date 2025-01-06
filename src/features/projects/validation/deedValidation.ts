import type { Deed } from '../types';

export interface ValidationError {
  field: string;
  message: string;
}

export function validateDeed(deed: Partial<Deed>): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!deed.name?.trim()) {
    errors.push({
      field: 'name',
      message: 'Deed name is required'
    });
  }

  if (!deed.projectId) {
    errors.push({
      field: 'projectId',
      message: 'Project ID is required'
    });
  }

  if (deed.pobCoordinates) {
    if (typeof deed.pobCoordinates.x !== 'number') {
      errors.push({
        field: 'pobCoordinates.x',
        message: 'POB X coordinate must be a number'
      });
    }
    if (typeof deed.pobCoordinates.y !== 'number') {
      errors.push({
        field: 'pobCoordinates.y',
        message: 'POB Y coordinate must be a number'
      });
    }
  }

  return errors;
}