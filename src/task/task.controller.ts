import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { Task } from './task.model';
import { Subtask } from './subtask.model';

@Controller('task')
export class TaskController {
  constructor(private taskService: TaskService) {}
  @Post('addTask')
  async register(@Body() taskData: Partial<Task>) {
    return this.taskService.create(taskData);
  }
  @Post('addSubTask')
  async addSubTask(
    @Query('taskId') taskId: string,
    @Body() subtaskData: Partial<Subtask>,
  ) {
    return this.taskService.createSubTask(taskId, subtaskData);
  }
  @Post('setSubTaskStatus')
  async setSubTaskStatus(
    @Query('subtaskId') subtaskId: number,
    @Body('status') status: 'pending' | 'complete',
  ) {
    console.log(subtaskId, status);
    if (!subtaskId) {
      throw new BadRequestException('Task ID is required');
    }

    if (!['pending', 'complete'].includes(status)) {
      throw new BadRequestException('Invalid status value');
    }

    try {
      const updatedSubTask = await this.taskService.updateSubTaskStatus(
        subtaskId,
        status,
      );
      return {
        message: 'Subtask status updated successfully',
        subTask: updatedSubTask,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  @Get('get')
  async getAllTasks(): Promise<Task[]> {
    return this.taskService.getAllTasks();
  }
  @Get('getSubtask')
  async getAllSubTasks(@Query('taskId') taskId: string): Promise<Subtask[]> {
    return this.taskService.getAllSubTasks(taskId);
  }
  @Get('search')
  async searchTasks(@Query('title') title: string): Promise<Task[]> {
    return this.taskService.searchAllTasks(title);
  }
}
