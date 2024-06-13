import {
  Model,
  Column,
  Table,
  DataType,
  ForeignKey,
} from "sequelize-typescript";
import { User } from "./user";
import { Challenge } from "./challenge";

@Table({
  timestamps: true,
  tableName: "Challenge_Review",
})
export class ChallengeReview extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  challenge_review_id!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  challenge_review_text!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  challenge_review_rating!: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  challenge_review_date!: Date;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  user_id!: number;

  @ForeignKey(() => Challenge)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  challenge_id!: number;
}
