import type { Project } from '../types';
import { validateProject } from '../validation/projectValidation';
import { projectEventEmitter } from '../events/projectEvents';
import { BaseService } from './BaseService';

export class ProjectService extends BaseService {
  private projects: Project[] = [];
  private currentProjectId: string | null = null;

  addProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Project {
    const errors = validateProject(project);
    this.validateOrThrow(errors);

    const newProject: Project = {
      ...project,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.projects.push(newProject);
    projectEventEmitter.emit({ type: 'created', project: newProject });
    
    return newProject;
  }

  updateProject(projectId: string, updates: Partial<Omit<Project, 'id' | 'createdAt' | 'updatedAt'>>): Project {
    const project = this.projects.find(p => p.id === projectId);
    if (!project) {
      this.handleNotFound('Project', projectId);
    }

    const errors = validateProject({ ...project, ...updates });
    this.validateOrThrow(errors);

    Object.assign(project, {
      ...updates,
      updatedAt: new Date()
    });

    projectEventEmitter.emit({ type: 'updated', project });
    return project;
  }

  deleteProject(projectId: string): boolean {
    const index = this.projects.findIndex(p => p.id === projectId);
    if (index === -1) {
      this.handleNotFound('Project', projectId);
    }

    const project = this.projects[index];
    this.projects.splice(index, 1);
    
    if (this.currentProjectId === projectId) {
      this.currentProjectId = null;
    }

    projectEventEmitter.emit({ type: 'deleted', project });
    return true;
  }

  getProjects(): Project[] {
    return [...this.projects];
  }

  getCurrentProject(): Project | null {
    return this.projects.find(p => p.id === this.currentProjectId) || null;
  }

  setCurrentProject(projectId: string | null): void {
    if (projectId && !this.projects.find(p => p.id === projectId)) {
      this.handleNotFound('Project', projectId);
    }
    
    this.currentProjectId = projectId;
    
    if (projectId) {
      const project = this.getCurrentProject();
      if (project) {
        projectEventEmitter.emit({ type: 'selected', project });
      }
    }
  }
}

export const projectService = new ProjectService();