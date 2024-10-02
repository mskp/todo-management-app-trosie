import { Module } from '@nestjs/common';
import { GistController } from './gist.controller';
import { GistService } from './gist.service';

@Module({
  providers: [GistService],
  controllers: [GistController],
})
export class GistModule {}
