import { Test, TestingModule } from '@nestjs/testing';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { TodoDto, ToggleCompleteDto } from './todo.dto';
import { Request } from 'express';

describe('TodoController', () => {
  let todoController: TodoController;
  let todoService: TodoService;

  const mockTodoService = {
    createTodo: jest.fn(),
    toggleComplete: jest.fn(),
    updateTodoDescription: jest.fn(),
    deleteTodo: jest.fn(),
  };

  const mockRequest = {
    user: {
      id: 1,
    },
  } as Request;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [
        {
          provide: TodoService,
          useValue: mockTodoService,
        },
      ],
    }).compile();

    todoController = module.get<TodoController>(TodoController);
    todoService = module.get<TodoService>(TodoService);
  });

  it('should be defined', () => {
    expect(todoController).toBeDefined();
  });

  describe('addTodo', () => {
    it('should call todoService.createTodo with the correct parameters', async () => {
      const createTodoDto: TodoDto = { description: 'Test todo' };
      const projectId = 1;

      await todoController.addTodo(projectId, createTodoDto);

      expect(mockTodoService.createTodo).toHaveBeenCalledWith({
        projectId,
        description: 'Test todo',
      });
    });
  });

  describe('toggleComplete', () => {
    it('should call todoService.toggleComplete with correct parameters', async () => {
      const todoId = 1;
      const toggleCompleteDto: ToggleCompleteDto = { status: true };

      await todoController.toggleComplete(todoId, toggleCompleteDto);

      expect(mockTodoService.toggleComplete).toHaveBeenCalledWith({
        todoId,
        status: true,
      });
    });
  });

  describe('updateTodo', () => {
    it('should call todoService.updateTodoDescription with correct parameters', async () => {
      const todoId = 1;
      const updateTodoDto: TodoDto = { description: 'Updated todo' };

      await todoController.updateTodo(todoId, updateTodoDto);

      expect(mockTodoService.updateTodoDescription).toHaveBeenCalledWith({
        id: todoId,
        description: 'Updated todo',
      });
    });
  });

  describe('deleteTodo', () => {
    it('should call todoService.deleteTodo with correct parameters', async () => {
      const todoId = 1;

      await todoController.deleteTodo(todoId);

      expect(mockTodoService.deleteTodo).toHaveBeenCalledWith({
        todoId,
      });
    });
  });
});
