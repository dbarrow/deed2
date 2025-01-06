import { describe, it, expect, beforeEach } from 'vitest';
import { deedService } from '../DeedService';
import { ServiceError } from '../../errors/ServiceError';

describe('DeedService', () => {
  const testDeed = {
    projectId: 'test-project',
    name: 'Test Deed',
    pobCoordinates: { x: 1000, y: 1000 },
    calls: []
  };

  beforeEach(() => {
    // Reset deeds before each test
    (deedService as any).deedsByProject = {};
  });

  describe('addDeed', () => {
    it('should add a valid deed', () => {
      const deed = deedService.addDeed(testDeed);
      
      expect(deed.id).toBeDefined();
      expect(deed.name).toBe(testDeed.name);
      expect(deed.projectId).toBe(testDeed.projectId);
      expect(deed.createdAt).toBeInstanceOf(Date);
      expect(deed.updatedAt).toBeInstanceOf(Date);
    });

    it('should throw validation error for empty name', () => {
      expect(() => deedService.addDeed({ ...testDeed, name: '' }))
        .toThrow(ServiceError);
    });

    it('should throw validation error for missing projectId', () => {
      expect(() => deedService.addDeed({ ...testDeed, projectId: '' }))
        .toThrow(ServiceError);
    });
  });

  describe('updateDeed', () => {
    it('should update existing deed', () => {
      const deed = deedService.addDeed(testDeed);
      const updated = deedService.updateDeed(
        deed.id,
        deed.projectId,
        { name: 'Updated Name' }
      );
      
      expect(updated.name).toBe('Updated Name');
      expect(updated.updatedAt).not.toBe(deed.updatedAt);
    });

    it('should throw not found error for non-existent deed', () => {
      expect(() => deedService.updateDeed(
        'fake-id',
        testDeed.projectId,
        { name: 'New Name' }
      )).toThrow(ServiceError);
    });
  });

  describe('deleteDeed', () => {
    it('should delete existing deed', () => {
      const deed = deedService.addDeed(testDeed);
      expect(deedService.deleteDeed(deed.id, deed.projectId)).toBe(true);
      expect(deedService.getProjectDeeds(deed.projectId)).toHaveLength(0);
    });

    it('should throw not found error for non-existent deed', () => {
      expect(() => deedService.deleteDeed('fake-id', testDeed.projectId))
        .toThrow(ServiceError);
    });
  });

  describe('getProjectDeeds', () => {
    it('should return empty array for non-existent project', () => {
      expect(deedService.getProjectDeeds('fake-project')).toHaveLength(0);
    });

    it('should return all deeds for a project', () => {
      const deed1 = deedService.addDeed(testDeed);
      const deed2 = deedService.addDeed({
        ...testDeed,
        name: 'Second Deed'
      });

      const deeds = deedService.getProjectDeeds(testDeed.projectId);
      expect(deeds).toHaveLength(2);
      expect(deeds[0].id).toBe(deed1.id);
      expect(deeds[1].id).toBe(deed2.id);
    });
  });
});