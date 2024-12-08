import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Task } from './task.model';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Subtask } from './subtask.model';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task) private taskModel: typeof Task,
    @InjectModel(Subtask) private subTaskModel: typeof Subtask,
  ) {}

  async create(taskData: Partial<Task>): Promise<Task> {
    const existingTask = await this.taskModel.findOne({
      where: { title: taskData.title },
    });
    if (existingTask) {
      throw new ConflictException('A task with this title already exists.');
    }
    return this.taskModel.create(taskData);
  }

  async getAllTasks(): Promise<Task[]> {
    return this.taskModel.findAll();
  }
  async getAllSubTasks(taskId: string): Promise<Subtask[]> {
    return this.subTaskModel.findAll({
      where: { taskId: taskId },
    });
  }
  async updateSubTaskStatus(subTaskId: number, status: 'pending' | 'complete') {
    console.log(status);
    if (!['pending', 'complete'].includes(status)) {
      throw new Error('Invalid status value');
    }
    const [updatedRowsCount] = await this.subTaskModel.update(
      { status },
      { where: { id: subTaskId } }
    );
    if (updatedRowsCount === 0) {
      throw new Error(`No Subtask found with id ${subTaskId}`);
    }
  
    const updatedSubTask = await this.subTaskModel.findByPk(subTaskId);
  
    return updatedSubTask;
  }
  async searchAllTasks(inTitle: string): Promise<Task[]> {
    return this.taskModel.findAll({
      where: {
        title: {
          [Op.like]: `%${inTitle}%`,
        },
      },
    });
  }
  async createSubTask(
    taskId: string,
    subtaskData: Partial<Subtask>,
  ): Promise<Subtask> {
    const task = await this.taskModel.findByPk(taskId);
    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }
    const data = {
      short_description: subtaskData.short_description,
      long_description: subtaskData.long_description,
      date_end: subtaskData.date_end,
      taskId: task.id,
    };
    return this.subTaskModel.create(data, { include: [] });
  }
}
