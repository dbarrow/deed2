import type { Deed } from '../types';
import { validateDeed } from '../validation/deedValidation';
import { deedEventEmitter } from '../events/deedEvents';
import { BaseService } from './BaseService';

export class DeedService extends BaseService {
  private deedsByProject: Record<string, Deed[]> = {};

  addDeed(deed: Omit<Deed, 'id' | 'createdAt' | 'updatedAt'>): Deed {
    const errors = validateDeed(deed);
    this.validateOrThrow(errors);

    if (!this.deedsByProject[deed.projectId]) {
      this.deedsByProject[deed.projectId] = [];
    }

    const newDeed: Deed = {
      ...deed,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.deedsByProject[deed.projectId].push(newDeed);
    deedEventEmitter.emit({ 
      type: 'created', 
      deed: newDeed, 
      projectId: deed.projectId 
    });

    return newDeed;
  }

  updateDeed(deedId: string, projectId: string, updates: Partial<Omit<Deed, 'id' | 'projectId' | 'createdAt' | 'updatedAt'>>): Deed {
    const deed = this.getDeed(deedId, projectId);
    if (!deed) {
      this.handleNotFound('Deed', deedId);
    }

    const errors = validateDeed({ ...deed, ...updates });
    this.validateOrThrow(errors);

    Object.assign(deed, {
      ...updates,
      updatedAt: new Date()
    });

    deedEventEmitter.emit({ 
      type: 'updated', 
      deed, 
      projectId 
    });

    return deed;
  }

  deleteDeed(deedId: string, projectId: string): boolean {
    const deeds = this.deedsByProject[projectId];
    if (!deeds) {
      this.handleNotFound('Project', projectId);
    }

    const index = deeds.findIndex(d => d.id === deedId);
    if (index === -1) {
      this.handleNotFound('Deed', deedId);
    }

    const deed = deeds[index];
    deeds.splice(index, 1);

    deedEventEmitter.emit({ 
      type: 'deleted', 
      deed, 
      projectId 
    });

    return true;
  }

  getProjectDeeds(projectId: string): Deed[] {
    return [...(this.deedsByProject[projectId] || [])];
  }

  getDeed(deedId: string, projectId: string): Deed | null {
    return this.deedsByProject[projectId]?.find(d => d.id === deedId) || null;
  }
}

export const deedService = new DeedService();