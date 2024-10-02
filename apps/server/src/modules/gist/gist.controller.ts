import {
  Controller,
  Post,
  Param,
  ParseIntPipe,
  Res,
  Get,
} from '@nestjs/common';
import { GistService } from './gist.service';
import { Response } from 'express';

@Controller('gist')
export class GistController {
  constructor(private readonly gistService: GistService) {}

  @Post('/export/:projectId')
  exportProjectAsGist(@Param('projectId', ParseIntPipe) projectId: number) {
    return this.gistService.exportProjectAsGist(projectId);
  }

  @Get('/download/:gistId')
  async downloadGistAsMarkdown(
    @Param('gistId') gistId: string,
    @Res() response: Response,
  ) {
    return this.gistService.downloadGistAsMarkdown(gistId, response);
  }
}
