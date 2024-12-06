import { ConflictException, Injectable } from '@nestjs/common';
import { Task } from './task.model';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class TaskService {
  constructor(@InjectModel(Task) private taskModel: typeof Task) {}
  async create(taskData: Partial<Task>): Promise<Task> {
    const existingTask = await this.taskModel.findOne({
      where: { title: taskData.title },
    });
    if (existingTask) {
      throw new ConflictException('A task with this title already exists.');
    }
    return this.taskModel.create(taskData);
  }
}
