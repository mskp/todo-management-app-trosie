import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../common/database/database.service';
import { standardResponse } from '../../common/utils/standard-response';

@Injectable()
export class TodoService {
  constructor(private readonly databaseService: DatabaseService) {}

  /**
   * Creates a new todo item for a specific project.
   * @param {Object} param - The parameters for creating a todo.
   * @param {number} param.projectId - The ID of the project to which the todo belongs.
   * @param {string} param.description - The description of the todo item.
   * @returns The created todo item.
   * @throws {NotFoundException} - Thrown if the project is not found.
   */
  async createTodo({
    projectId,
    description,
  }: {
    projectId: number;
    description: string;
  }) {
    const project = await this.databaseService.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found.`);
    }

    return this.databaseService.todo.create({
      data: {
        projectId,
        description,
      },
    });
  }

  /**
   * Toggles the completion status of a todo item.
   * @param {Object} param - The parameters for toggling the todo status.
   * @param {number} param.todoId - The ID of the todo item.
   * @param {boolean} param.status - The new status of the todo item (true for complete, false for incomplete).
   * @returns The updated todo item.
   * @throws {NotFoundException} - Thrown if the todo is not found.
   */
  async toggleComplete({
    todoId,
    status,
  }: {
    todoId: number;
    status: boolean;
  }) {
    const todo = await this._findOne(todoId);

    if (!todo) {
      throw new NotFoundException(`Todo not found.`);
    }

    return this.databaseService.todo.update({
      where: { id: todoId },
      data: { status },
    });
  }

  /**
   * Updates the description of an existing todo item.
   * @param {Object} param - The parameters for updating the todo description.
   * @param {number} param.id - The ID of the todo item.
   * @param {string} param.description - The new description for the todo item.
   * @returns The updated todo item.
   * @throws {NotFoundException} - Thrown if the todo item is not found.
   */
  async updateTodoDescription({
    id,
    description,
  }: {
    id: number;
    description: string;
  }) {
    const todo = await this._findOne(id);

    if (!todo) throw new NotFoundException(`Todo with ID ${id} not found.`);

    return this.databaseService.todo.update({
      where: { id },
      data: { description },
    });
  }

  /**
   * Deletes a todo item by its ID.
   * @param {Object} param - The parameters for deleting the todo.
   * @param {number} param.todoId - The ID of the todo item to delete.
   * @returns  A standard response confirming the deletion.
   */
  async deleteTodo({ todoId }: { todoId: number }) {
    await this.databaseService.todo.delete({
      where: {
        id: todoId,
      },
    });

    return standardResponse({
      message: 'Todo deleted successfully',
    });
  }

  /**
   * Finds a todo item by its ID.
   * @param {number} id - The ID of the todo item to find.
   * @returns - The found todo item, or null if not found.
   * @private
   */
  private async _findOne(id: number) {
    const todo = await this.databaseService.todo.findUnique({
      where: { id },
    });

    return todo;
  }
}
