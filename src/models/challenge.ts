import { Model, Column, Table, DataType } from "sequelize-typescript";

@Table({
  timestamps: true,
  tableName: "Challenge",
})
export class Challenge extends Model {
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  })
  challenge_id!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  challenge_detail!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  challenge_thumbnail!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  challenge_total!: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  challenge_recurit_start!: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  challenge_recurit_end!: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  challenge_start!: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  challenge_end!: Date;
}
