import { Column, Model, Table, DataType } from 'sequelize-typescript';

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
    allowNull: false,
  })
  date_end: string;
}
