import { Model, Column, Table, DataType } from "sequelize-typescript";

@Table({
  timestamps: true,
  tableName: "Reward",
})
export class Reward extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  reward_id!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  reward_name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  reward_explain!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  reward_img_url!: string;
}
