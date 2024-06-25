import {
  Model,
  Column,
  Table,
  DataType,
  ForeignKey,
  Default,
} from "sequelize-typescript";
import { ChallengeParticipation } from "./challengeParticipation";

@Table({
  timestamps: true,
  tableName: "Challenge_Post",
})
export class ChallengePost extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  challenge_post_id!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  challenge_post_text!: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW, // 기본값을 현재 날짜와 시간으로 설정
  })
  challenge_post_date!: Date;

  @ForeignKey(() => ChallengeParticipation)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  challenge_participation_id!: number;
}
