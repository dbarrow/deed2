import type { Project } from '../types';

export interface ValidationError {
  field: string;
  message: string;
}

export function validateProject(project: Partial<Project>): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!project.name?.trim()) {
    errors.push({
      field: 'name',
      message: 'Project name is required'
    });
  }

  if (project.name && project.name.length > 100) {
    errors.push({
      field: 'name',
      message: 'Project name cannot exceed 100 characters'
    });
  }

  return errors;
}