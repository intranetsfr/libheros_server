import { Column, Model, Table, DataType, HasMany } from 'sequelize-typescript';
import { Subtask } from './subtask.model';

@Table
export class Task extends Model<Task> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;
  @HasMany(() => Subtask, { onDelete: 'CASCADE' })
  subtasks: Subtask[];
}
