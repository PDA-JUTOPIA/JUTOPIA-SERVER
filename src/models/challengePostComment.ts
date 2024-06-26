import {
  Model,
  Column,
  Table,
  DataType,
  ForeignKey,
  Default,
} from "sequelize-typescript";
import { User } from "./user";
import { ChallengePost } from "./challengePost";

@Table({
  timestamps: true,
  tableName: "Challenge_Post_Comment",
})
export class ChallengePostComment extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  challenge_post_comment_id!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  challenge_post_comment_text!: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  challenge_post_comment_date!: Date;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  user_id!: number;

  @ForeignKey(() => ChallengePost)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  challenge_post_id!: number;
}
