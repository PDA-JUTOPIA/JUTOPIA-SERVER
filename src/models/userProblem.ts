import {
  Model,
  Column,
  Table,
  DataType,
  ForeignKey,
} from "sequelize-typescript";
import { User } from "./user";
import { Problem } from "./problem";

@Table({
  timestamps: true,
  tableName: "User_Problem",
})
export class UserProblem extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  user_problem_id!: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  user_id!: number;

  @ForeignKey(() => Problem)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  problem_id!: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  is_correct!: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  attempt_date!: Date;
}
