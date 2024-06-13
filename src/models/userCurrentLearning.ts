import { Model, Column, Table, DataType } from "sequelize-typescript";

@Table({
  timestamps: true,
  tableName: "User_Current_Learning",
})
export class UserCurrentLearning extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  current_learning_id!: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  completeDate!: Date;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  current_learning!: number;
}
