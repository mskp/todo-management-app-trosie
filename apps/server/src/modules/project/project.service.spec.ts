import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseService } from '../../common/database/database.service';
import { ProjectService } from './project.service';

describe('ProjectService', () => {
  let projectService: ProjectService;
  let databaseService: DatabaseService;

  const mockDatabaseService = {
    project: {
      create: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
      ],
    }).compile();

    projectService = module.get<ProjectService>(ProjectService);
    databaseService = module.get<DatabaseService>(DatabaseService);
  });

  describe('createProject', () => {
    it('should create a project and return it', async () => {
      const project = { id: 1, title: 'Test Project', userId: 1 };
      mockDatabaseService.project.create.mockResolvedValue(project);

      const result = await projectService.createProject({
        userId: 1,
        title: 'Test Project',
      });

      expect(databaseService.project.create).toHaveBeenCalledWith({
        data: {
          title: 'Test Project',
          userId: 1,
        },
      });
      expect(result.data.project).toEqual(project);
    });
  });

  describe('editProject', () => {
    it('should update a project and return it', async () => {
      const project = { id: 1, title: 'Updated Project', userId: 1 };
      mockDatabaseService.project.update.mockResolvedValue(project);

      const result = await projectService.editProject({
        userId: 1,
        projectId: 1,
        title: 'Updated Project',
      });

      expect(databaseService.project.update).toHaveBeenCalledWith({
        where: { id: 1, userId: 1 },
        data: { title: 'Updated Project' },
      });
      expect(result.data.project).toEqual(project);
    });

    it('should throw a NotFoundException if project does not exist', async () => {
      mockDatabaseService.project.update.mockResolvedValue(null);

      await expect(
        projectService.editProject({
          userId: 1,
          projectId: 1,
          title: 'Updated Project',
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getProjectsByUser', () => {
    it('should return a list of projects with todos information', async () => {
      const projects = [
        {
          id: 1,
          title: 'Project 1',
          createdDate: new Date(),
          todos: [{ status: true }],
        },
        {
          id: 2,
          title: 'Project 2',
          createdDate: new Date(),
          todos: [{ status: false }],
        },
      ];
      mockDatabaseService.project.findMany.mockResolvedValue(projects);

      const result = await projectService.getProjectsByUser({ userId: 1 });

      expect(databaseService.project.findMany).toHaveBeenCalledWith({
        where: { userId: 1 },
        include: { todos: true },
        orderBy: { createdDate: 'desc' },
      });

      expect(result.data.projects).toEqual([
        {
          id: 1,
          title: 'Project 1',
          createdDate: projects[0].createdDate,
          totalTodos: 1,
          completedTodos: 1,
        },
        {
          id: 2,
          title: 'Project 2',
          createdDate: projects[1].createdDate,
          totalTodos: 1,
          completedTodos: 0,
        },
      ]);
    });
  });

  describe('getProjectDetail', () => {
    it('should return the project detail with todos', async () => {
      const project = {
        id: 1,
        title: 'Project 1',
        todos: [{ id: 1, status: true }],
        createdDate: new Date(),
      };
      mockDatabaseService.project.findUnique.mockResolvedValue(project);

      const result = await projectService.getProjectDetail({
        userId: 1,
        projectId: 1,
      });

      expect(databaseService.project.findUnique).toHaveBeenCalledWith({
        where: { id: 1, userId: 1 },
        select: {
          id: true,
          title: true,
          todos: { orderBy: { createdDate: 'desc' } },
          createdDate: true,
          userId: false,
        },
      });

      expect(result.data.project).toEqual(project);
    });

    it('should throw a NotFoundException if project does not exist', async () => {
      mockDatabaseService.project.findUnique.mockResolvedValue(null);

      await expect(
        projectService.getProjectDetail({
          userId: 1,
          projectId: 1,
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteProject', () => {
    it('should delete a project and return success response', async () => {
      const project = { id: 1, title: 'Test Project' };
      mockDatabaseService.project.delete.mockResolvedValue(project);

      const result = await projectService.deleteProject({
        userId: 1,
        projectId: 1,
      });

      expect(databaseService.project.delete).toHaveBeenCalledWith({
        where: { id: 1, userId: 1 },
      });
      expect(result.data.project).toEqual(project);
      expect(result.message).toBe('Project deleted successfully');
    });

    it('should throw a NotFoundException if project does not exist', async () => {
      mockDatabaseService.project.delete.mockResolvedValue(null);

      await expect(
        projectService.deleteProject({
          userId: 1,
          projectId: 1,
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
