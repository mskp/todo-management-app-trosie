import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { TodoDto, ToggleCompleteDto } from './todo.dto';
import { TodoService } from './todo.service';
import { Request } from 'express';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post('/:projectId')
  addTodo(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() createTodoDto: TodoDto,
  ) {
    return this.todoService.createTodo({
      projectId,
      description: createTodoDto.description,
    });
  }

  @Patch('/:todoId/complete')
  toggleComplete(
    @Param('todoId', ParseIntPipe) todoId: number,
    @Body() toggleCompleteDto: ToggleCompleteDto,
  ) {
    return this.todoService.toggleComplete({
      todoId,
      status: toggleCompleteDto.status,
    });
  }

  @Patch('/:todoId/update')
  updateTodo(
    @Param('todoId', ParseIntPipe) todoId: number,
    @Body() updateTodoDto: TodoDto,
  ) {
    return this.todoService.updateTodoDescription({
      id: todoId,
      description: updateTodoDto.description,
    });
  }

  @Delete('/:todoId')
  deleteTodo(@Param('todoId', ParseIntPipe) todoId: number) {
    return this.todoService.deleteTodo({
      todoId,
    });
  }
}
