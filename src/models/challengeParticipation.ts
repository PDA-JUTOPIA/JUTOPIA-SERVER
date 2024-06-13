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
  tableName: "Challenge_Participation",
})
export class ChallengeParticipation extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  challenge_participation_id!: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  is_challenge_end!: boolean;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  challenge_participation_count!: number;

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
