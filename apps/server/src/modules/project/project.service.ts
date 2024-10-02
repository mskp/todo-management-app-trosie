import { Injectable, NotFoundException } from '@nestjs/common';
import { standardResponse } from '../../common/utils/standard-response';
import { DatabaseService } from '../../common/database/database.service';

@Injectable()
export class ProjectService {
  constructor(private readonly databaseService: DatabaseService) {}

  /**
   * Creates a new project for the user.
   * @param {Object} param - The parameters for project creation.
   * @param {number} param.userId - The ID of the user.
   * @param {string} param.title - The title of the project.
   * @returns A standard response containing the created project.
   */
  async createProject({ userId, title }: { userId: number; title: string }) {
    const project = await this.databaseService.project.create({
      data: {
        title,
        userId,
      },
    });

    return standardResponse({
      data: { project },
    });
  }

  /**
   * Updates an existing project with a new title.
   * @param {Object} param - The parameters for editing the project.
   * @param {number} param.userId - The ID of the user.
   * @param {number} param.projectId - The ID of the project to update.
   * @param {string} param.title - The new title for the project.
   * @returns A standard response containing the updated project.
   * @throws {NotFoundException} - Thrown if the project is not found.
   */
  async editProject({
    userId,
    projectId,
    title,
  }: {
    userId: number;
    projectId: number;
    title: string;
  }) {
    const project = await this.databaseService.project.update({
      where: {
        id: projectId,
        userId,
      },
      data: {
        title,
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return standardResponse({
      data: { project },
    });
  }

  /**
   * Retrieves all projects belonging to a specific user.
   * @param {Object} param - The parameters for retrieving the user's projects.
   * @param {number} param.userId - The ID of the user.
   * @returns A standard response containing the user's projects, with todo statistics.
   */
  async getProjectsByUser({ userId }: { userId: number }) {
    const projects = await this.databaseService.project.findMany({
      where: { userId },
      include: { todos: true },
      orderBy: {
        createdDate: 'desc',
      },
    });

    const formattedProjects = projects.map((project) => ({
      id: project.id,
      title: project.title,
      createdDate: project.createdDate,
      totalTodos: project.todos.length,
      completedTodos: project.todos.filter((todo) => todo.status).length,
    }));

    return standardResponse({
      data: { projects: formattedProjects },
    });
  }

  /**
   * Retrieves the details of a specific project belonging to a user.
   * @param {Object} param - The parameters for retrieving project details.
   * @param {number} param.userId - The ID of the user.
   * @param {number} param.projectId - The ID of the project to retrieve.
   * @returns A standard response containing the project details.
   * @throws {NotFoundException} - Thrown if the project is not found.
   */
  async getProjectDetail({
    userId,
    projectId,
  }: {
    userId: number;
    projectId: number;
  }) {
    const project = await this.databaseService.project.findUnique({
      where: { id: projectId, userId },
      select: {
        id: true,
        title: true,
        todos: {
          orderBy: {
            createdDate: 'desc',
          },
        },
        createdDate: true,
        userId: false,
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found.');
    }

    return standardResponse({
      data: { project },
    });
  }

  /**
   * Deletes a specific project belonging to a user.
   * @param {Object} param - The parameters for deleting the project.
   * @param {number} param.userId - The ID of the user.
   * @param {number} param.projectId - The ID of the project to delete.
   * @returns A standard response confirming the deletion of the project.
   * @throws {NotFoundException} - Thrown if the project is not found.
   */
  async deleteProject({
    userId,
    projectId,
  }: {
    userId: number;
    projectId: number;
  }) {
    const project = await this.databaseService.project.delete({
      where: {
        id: projectId,
        userId,
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found.');
    }

    return standardResponse({
      message: 'Project deleted successfully',
      data: { project },
    });
  }
}
