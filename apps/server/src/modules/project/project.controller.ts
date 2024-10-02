import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  ParseIntPipe,
  Req,
  Patch,
  Delete,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto, EditProjectDto } from './project.dto';
import { Request } from 'express';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  createProject(
    @Req() request: Request,
    @Body() createProjectDto: CreateProjectDto,
  ) {
    const userId = request.user?.id;
    return this.projectService.createProject({
      userId,
      title: createProjectDto.title,
    });
  }

  @Patch(':projectId')
  editProject(
    @Req() request: Request,
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() editProjectDto: EditProjectDto,
  ) {
    const userId = request.user?.id;
    return this.projectService.editProject({
      userId,
      projectId,
      title: editProjectDto.title,
    });
  }

  @Get()
  getUserProjects(@Req() request: Request) {
    const userId = request.user?.id;
    return this.projectService.getProjectsByUser({ userId });
  }

  @Get(':projectId')
  getProjectDetail(
    @Req() request: Request,
    @Param('projectId', ParseIntPipe) projectId: number,
  ) {
    const userId = request.user?.id;
    return this.projectService.getProjectDetail({ userId, projectId });
  }

  @Delete(':projectId')
  deleteProject(
    @Req() request: Request,
    @Param('projectId', ParseIntPipe) projectId: number,
  ) {
    const userId = request.user?.id;
    return this.projectService.getProjectDetail({ userId, projectId });
  }
}
