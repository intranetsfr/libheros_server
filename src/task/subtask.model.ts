import { Column, Model, Table, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Task } from './task.model';

@Table
export class Subtask extends Model<Subtask> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  short_description: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  long_description: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  date_end: Date;
  

  @Column({
    type: DataType.ENUM('pending', 'complete'),
    allowNull: true,
    defaultValue: 'pending'
  })
  status: 'pending' | 'complete';
  @ForeignKey(() => Task)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  taskId: number;

  @BelongsTo(() => Task)
  task: Task;
}
