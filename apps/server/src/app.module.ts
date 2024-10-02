import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { DatabaseModule } from './common/database/database.module';
import { AuthGuard } from './modules/auth/auth.guard';
import { AuthModule } from './modules/auth/auth.module';
import { GistModule } from './modules/gist/gist.module';
import { ProjectModule } from './modules/project/project.module';
import { TodoModule } from './modules/todo/todo.module';

@Module({
  imports: [AuthModule, ProjectModule, TodoModule, DatabaseModule, GistModule],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
