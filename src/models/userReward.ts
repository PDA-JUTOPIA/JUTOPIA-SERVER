import {
  Model,
  Column,
  Table,
  DataType,
  ForeignKey,
} from "sequelize-typescript";
import { User } from "./user";
import { Reward } from "./reward";

@Table({
  timestamps: true,
  tableName: "User_Reward",
})
export class UserReward extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  user_reward_id!: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  user_reward_date!: Date;

  @ForeignKey(() => Reward)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  reward_id!: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  user_id!: number;
}
