import {
  Model,
  Column,
  Table,
  DataType,
  ForeignKey,
} from "sequelize-typescript";
import { ChallengePost } from "./challengePost";

@Table({
  timestamps: true,
  tableName: "Post_Photo",
})
export class PostPhoto extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  post_photo_id!: number;

  @ForeignKey(() => ChallengePost)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  challenge_post_id!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  post_photo_url!: string;
}
