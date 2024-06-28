import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASS as string,
  {
    host: process.env.DB_HOST as string,
    dialect: "mysql",
    port: parseInt(process.env.DB_PORT as string, 10),

    dialectOptions: {
      // useUTC: false, //for reading from database
      dateStrings: true,
      typeCast: true,
      timezone: "Asia/Seoul",
    },
    timezone: "Asia/Seoul", //for writing to database
  }
);

export default sequelize;
