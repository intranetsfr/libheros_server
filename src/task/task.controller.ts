import {
  BadRequestException,
  Body,
  Controller,
  Delete,
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
  @Delete()
  async deleteTask(@Query('taskId') taskId: number) {
    if (!taskId) {
      throw new BadRequestException(`l'identifiant de la liste de tache est requise`);
    }

    try {
      const result = await this.taskService.deleteTaskAndSubtasks(taskId);
      return result;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  @Delete('deleteSubtask')
  async deleteSubask(@Query('subtaskId') subtaskId: number) {
    if (!subtaskId) {
      throw new BadRequestException(`l'identifiant de la tâche est obligatoire`);
    }

    try {
      const result = await this.taskService.deleteSubtask(subtaskId);
      return result;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
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
    if (!subtaskId) {
      throw new BadRequestException(`l'identifiant de la note est obligatoire`);
    }

    if (!['pending', 'complete'].includes(status)) {
      throw new BadRequestException(`le status doit être uniquement pending ou complete`);
    }

    try {
      const updatedSubTask = await this.taskService.updateSubTaskStatus(
        subtaskId,
        status,
      );
      return {
        message: 'le status de la tâche a été mise à jour',
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
    if (!taskId) {
      throw new BadRequestException(`L'identifiant de la liste est obligatoire`);
    }
    return this.taskService.getAllSubTasks(taskId);
  }
  @Get('search')
  async searchTasks(@Query('title') title: string): Promise<Task[]> {

    if (!title) {
      throw new BadRequestException('Le titre est obligatoire');
    }

    return this.taskService.searchAllTasks(title);
  }
}
