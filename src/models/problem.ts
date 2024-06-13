import { Model, Column, Table, DataType } from "sequelize-typescript";
import { Col } from "sequelize/types/utils";

@Table({
  timestamps: true,
  tableName: "Problem",
})
export class Problem extends Model {
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  })
  problem_id!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  problem_number!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  problem!: string;

  @Column({
    type: DataType.STRING,
  })
  problem_detail?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  problem_select_a!: string;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  problem_select_b!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  problem_select_c!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  problem_select_d!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  answer!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  answer_detail!: string;
}
