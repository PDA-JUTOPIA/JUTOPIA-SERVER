import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({
  tableName: "Column_Board",
  timestamps: true, // createdAt, updatedAt을 자동으로 관리합니다.
})
export class ColumnBoard extends Model {
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  bbs_name!: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  title!: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  writer!: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  reg_date!: Date;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  attachment_url?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  content?: string;
}
