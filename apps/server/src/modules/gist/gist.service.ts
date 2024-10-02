import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { DatabaseService } from '../../common/database/database.service';
import { standardResponse } from '../../common/utils/standard-response';
import { ExportProjectAsGistResponse, GistResponse } from './types';

@Injectable()
export class GistService {
  private readonly GITHUB_API_URL = 'https://api.github.com/gists';
  private readonly GITHUB_TOKEN: string = process.env.GITHUB_TOKEN;

  constructor(private readonly databaseService: DatabaseService) {}

  /**
   * Exports a project as a GitHub Gist, including its completed and pending tasks.
   * @param {number} projectId - The ID of the project to be exported.
   * @returns {Promise<ExportProjectAsGistResponse>} - A response containing the Gist URL.
   * @throws {NotFoundException} - If the project with the given ID is not found.
   * @throws {InternalServerErrorException} - If the Gist creation fails.
   */
  async exportProjectAsGist(projectId: number): ExportProjectAsGistResponse {
    const project = await this.databaseService.project.findUnique({
      where: { id: projectId },
      include: { todos: true },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found.`);
    }

    const completedTodos = project.todos.filter((todo) => todo.status);
    const pendingTodos = project.todos.filter((todo) => !todo.status);

    const content = `
# ${project.title}
## Summary: ${completedTodos.length} / ${project.todos.length} completed.

### Pending Todos:
${pendingTodos.map((todo) => `- [ ] ${todo.description}`).join('\n')}

### Completed Todos:
${completedTodos.map((todo) => `- [x] ${todo.description}`).join('\n')}
    `.trim();

    const gistData = this._generateGistData(project.title, content);

    const response = await fetch(this.GITHUB_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(gistData),
    });

    if (!response.ok) {
      throw new InternalServerErrorException(
        `Failed to create gist: ${response.statusText}`,
      );
    }

    const gist = (await response.json()) as GistResponse;

    if (!gist.html_url) {
      throw new InternalServerErrorException(
        'Gist created, but URL is missing.',
      );
    }

    return standardResponse({
      success: true,
      message: 'Gist created successfully',
      data: {
        gistUrl: gist.html_url,
      },
    });
  }

  /**
   * Fetches a Gist by its ID and sends its content as a downloadable markdown file.
   * @param {string} gistId - The ID of the Gist to download.
   * @param {Response} res - The Express response object to send the markdown content.
   * @throws {NotFoundException} - If the Gist with the given ID is not found.
   */
  async downloadGistAsMarkdown(
    gistId: string,
    @Res() res: Response,
  ): Promise<void> {
    const response = await fetch(`${this.GITHUB_API_URL}/${gistId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.GITHUB_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new NotFoundException(`Gist with ID ${gistId} not found.`);
    }

    const gist = (await response.json()) as {
      files: Record<string, { content: string }>;
    };

    const [filename, fileData] = Object.entries(gist.files)[0];

    res.setHeader('Content-Type', 'text/markdown');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(fileData.content);
  }

  /**
   * Generates the data structure for creating a new Gist.
   * @param {string} title - The title of the project to be used in the Gist description.
   * @param {string} content - The content of the markdown file to be included in the Gist.
   * @returns The data to be sent to the GitHub API.
   */
  private _generateGistData(title: string, content: string) {
    const gistData = {
      description: `Project: ${title}`,
      public: false,
      files: {
        [`${title}.md`]: {
          content,
        },
      },
    };

    return gistData;
  }
}
