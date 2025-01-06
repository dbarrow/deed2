import { describe, it, expect, beforeEach } from 'vitest';
import { projectService } from '../ProjectService';
import { ServiceError } from '../../errors/ServiceError';

describe('ProjectService', () => {
  const testProject = {
    name: 'Test Project',
    description: 'Test Description'
  };

  beforeEach(() => {
    // Reset projects array before each test
    (projectService as any).projects = [];
    (projectService as any).currentProjectId = null;
  });

  describe('addProject', () => {
    it('should add a valid project', () => {
      const project = projectService.addProject(testProject);
      
      expect(project.id).toBeDefined();
      expect(project.name).toBe(testProject.name);
      expect(project.createdAt).toBeInstanceOf(Date);
      expect(project.updatedAt).toBeInstanceOf(Date);
    });

    it('should throw validation error for empty name', () => {
      expect(() => projectService.addProject({ ...testProject, name: '' }))
        .toThrow(ServiceError);
    });
  });

  describe('updateProject', () => {
    it('should update existing project', () => {
      const project = projectService.addProject(testProject);
      const updated = projectService.updateProject(project.id, { name: 'Updated Name' });
      
      expect(updated.name).toBe('Updated Name');
      expect(updated.updatedAt).not.toBe(project.updatedAt);
    });

    it('should throw not found error for non-existent project', () => {
      expect(() => projectService.updateProject('fake-id', { name: 'New Name' }))
        .toThrow(ServiceError);
    });
  });

  describe('deleteProject', () => {
    it('should delete existing project', () => {
      const project = projectService.addProject(testProject);
      expect(projectService.deleteProject(project.id)).toBe(true);
      expect(projectService.getProjects()).toHaveLength(0);
    });

    it('should clear currentProjectId if deleting current project', () => {
      const project = projectService.addProject(testProject);
      projectService.setCurrentProject(project.id);
      projectService.deleteProject(project.id);
      expect(projectService.getCurrentProject()).toBeNull();
    });
  });

  describe('getCurrentProject', () => {
    it('should return null when no project is selected', () => {
      expect(projectService.getCurrentProject()).toBeNull();
    });

    it('should return current project when selected', () => {
      const project = projectService.addProject(testProject);
      projectService.setCurrentProject(project.id);
      expect(projectService.getCurrentProject()?.id).toBe(project.id);
    });
  });
});