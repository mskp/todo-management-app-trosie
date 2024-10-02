import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TodoService } from './todo.service';
import { DatabaseService } from '../../common/database/database.service';
import { standardResponse } from '../../common/utils/standard-response';

describe('TodoService', () => {
  let todoService: TodoService;
  let databaseService: DatabaseService;

  const mockDatabaseService = {
    project: {
      findUnique: jest.fn(),
    },
    todo: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
      ],
    }).compile();

    todoService = module.get<TodoService>(TodoService);
    databaseService = module.get<DatabaseService>(DatabaseService);
  });

  it('should be defined', () => {
    expect(todoService).toBeDefined();
  });

  describe('createTodo', () => {
    it('should throw NotFoundException if project is not found', async () => {
      mockDatabaseService.project.findUnique.mockResolvedValue(null);

      await expect(
        todoService.createTodo({
          projectId: 1,
          description: 'Test todo',
        }),
      ).rejects.toThrow(new NotFoundException('Project with ID 1 not found.'));
    });

    it('should call databaseService.todo.create with correct parameters', async () => {
      mockDatabaseService.project.findUnique.mockResolvedValue({ id: 1 });
      mockDatabaseService.todo.create.mockResolvedValue({
        id: 1,
        description: 'Test todo',
      });

      const result = await todoService.createTodo({
        projectId: 1,
        description: 'Test todo',
      });

      expect(mockDatabaseService.todo.create).toHaveBeenCalledWith({
        data: {
          projectId: 1,
          description: 'Test todo',
        },
      });
      expect(result).toEqual({ id: 1, description: 'Test todo' });
    });
  });

  describe('toggleComplete', () => {
    it('should throw NotFoundException if todo is not found', async () => {
      mockDatabaseService.todo.findUnique.mockResolvedValue(null);

      await expect(
        todoService.toggleComplete({ todoId: 1, status: true }),
      ).rejects.toThrow(new NotFoundException('Todo not found.'));
    });

    it('should call databaseService.todo.update with correct parameters', async () => {
      mockDatabaseService.todo.findUnique.mockResolvedValue({
        id: 1,
        status: false,
      });
      mockDatabaseService.todo.update.mockResolvedValue({
        id: 1,
        status: true,
      });

      const result = await todoService.toggleComplete({
        todoId: 1,
        status: true,
      });

      expect(mockDatabaseService.todo.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { status: true },
      });
      expect(result).toEqual({ id: 1, status: true });
    });
  });

  describe('updateTodoDescription', () => {
    it('should throw NotFoundException if todo is not found', async () => {
      mockDatabaseService.todo.findUnique.mockResolvedValue(null);

      await expect(
        todoService.updateTodoDescription({
          id: 1,
          description: 'Updated description',
        }),
      ).rejects.toThrow(new NotFoundException('Todo with ID 1 not found.'));
    });

    it('should call databaseService.todo.update with correct parameters', async () => {
      mockDatabaseService.todo.findUnique.mockResolvedValue({
        id: 1,
        description: 'Old description',
      });
      mockDatabaseService.todo.update.mockResolvedValue({
        id: 1,
        description: 'Updated description',
      });

      const result = await todoService.updateTodoDescription({
        id: 1,
        description: 'Updated description',
      });

      expect(mockDatabaseService.todo.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { description: 'Updated description' },
      });
      expect(result).toEqual({ id: 1, description: 'Updated description' });
    });
  });

  describe('deleteTodo', () => {
    it('should call databaseService.todo.delete with correct parameters', async () => {
      mockDatabaseService.todo.delete.mockResolvedValue({});

      const result = await todoService.deleteTodo({ todoId: 1 });

      expect(mockDatabaseService.todo.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(
        standardResponse({ message: 'Todo deleted successfully' }),
      );
    });
  });
});
