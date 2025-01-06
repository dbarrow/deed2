export interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Deed {
  id: string;
  projectId: string;
  name: string;
  description?: string;
  pobCoordinates: {
    x: number;
    y: number;
  };
  calls: DeedCall[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectState {
  projects: Project[];
  currentProjectId: string | null;
  currentDeedId: string | null;
}