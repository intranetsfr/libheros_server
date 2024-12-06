import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Task } from './task.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Task]),
    TaskModule,
  ],
  providers: [TaskService],
  controllers: [TaskController]
})
export class TaskModule {}
