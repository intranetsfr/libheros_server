import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { TaskService } from './task.service';
import { Task } from './task.model';

@Controller('task')
export class TaskController {
  constructor(private taskService: TaskService) {}
  @Post('addTask')
  async register(@Body() taskData: Partial<Task>) {
    return this.taskService.create(taskData);
  }
  @Get('get')
  async getAllTasks(): Promise<Task[]> {
    return this.taskService.getAllTasks();
  }
  @Get('search')
  async searchTasks(@Query('title') title: string): Promise<Task[]> {
    return this.taskService.searchAllTasks(title);
  }
}
