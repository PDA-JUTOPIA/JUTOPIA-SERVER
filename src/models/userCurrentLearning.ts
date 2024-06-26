import {
  Model,
  Column,
  Table,
  DataType,
  ForeignKey,
} from "sequelize-typescript";
import { User } from "./user";
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
    type: DataType.INTEGER,
    allowNull: false,
  })
  current_learning!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  current_reward!: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  user_id!: number;
}
