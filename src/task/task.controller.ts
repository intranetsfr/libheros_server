import { Body, Controller, Post } from '@nestjs/common';
import { TaskService } from './task.service';
import { Task } from './task.model';

@Controller('task')
export class TaskController {
    constructor(private taskService:TaskService){

    }
    @Post('addTask')
    async register(@Body() taskData: Partial<Task>){
      return this.taskService.create(taskData);
    }
}
