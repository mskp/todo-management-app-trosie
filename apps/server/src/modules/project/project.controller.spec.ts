import { Test, TestingModule } from '@nestjs/testing';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { CreateProjectDto, EditProjectDto } from './project.dto';

describe('ProjectController', () => {
  let projectController: ProjectController;
  let projectService: ProjectService;

  const mockProjectService = {
    createProject: jest.fn(),
    editProject: jest.fn(),
    getProjectsByUser: jest.fn(),
    getProjectDetail: jest.fn(),
    deleteProject: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectController],
      providers: [
        {
          provide: ProjectService,
          useValue: mockProjectService,
        },
      ],
    }).compile();

    projectController = module.get<ProjectController>(ProjectController);
    projectService = module.get<ProjectService>(ProjectService);
  });

  it('should be defined', () => {
    expect(projectController).toBeDefined();
  });

  describe('createProject', () => {
    it('should call projectService.createProject with the correct parameters', async () => {
      const request = { user: { id: 1 } } as any;
      const createProjectDto: CreateProjectDto = { title: 'Test Project' };

      await projectController.createProject(request, createProjectDto);

      expect(mockProjectService.createProject).toHaveBeenCalledWith({
        userId: 1,
        title: 'Test Project',
      });
    });
  });

  describe('editProject', () => {
    it('should call projectService.editProject with the correct parameters', async () => {
      const request = { user: { id: 1 } } as any;
      const editProjectDto: EditProjectDto = { title: 'Updated Project' };
      const projectId = 2;

      await projectController.editProject(request, projectId, editProjectDto);

      expect(mockProjectService.editProject).toHaveBeenCalledWith({
        userId: 1,
        projectId: 2,
        title: 'Updated Project',
      });
    });
  });

  describe('getUserProjects', () => {
    it('should call projectService.getProjectsByUser with the correct userId', async () => {
      const request = { user: { id: 1 } } as any;

      await projectController.getUserProjects(request);

      expect(mockProjectService.getProjectsByUser).toHaveBeenCalledWith({
        userId: 1,
      });
    });
  });

  describe('getProjectDetail', () => {
    it('should call projectService.getProjectDetail with the correct parameters', async () => {
      const request = { user: { id: 1 } } as any;
      const projectId = 3;

      await projectController.getProjectDetail(request, projectId);

      expect(mockProjectService.getProjectDetail).toHaveBeenCalledWith({
        userId: 1,
        projectId: 3,
      });
    });
  });

  describe('deleteProject', () => {
    it('should call projectService.getProjectDetail with the correct parameters', async () => {
      const request = { user: { id: 1 } } as any;
      const projectId = 4;

      await projectController.deleteProject(request, projectId);

      expect(mockProjectService.getProjectDetail).toHaveBeenCalledWith({
        userId: 1,
        projectId: 4,
      });
    });
  });
});
