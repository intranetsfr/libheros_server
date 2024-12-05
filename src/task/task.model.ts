import { Column, Model, Table, DataType } from 'sequelize-typescript';

@Table
export class Task extends Model<Task> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;
}
