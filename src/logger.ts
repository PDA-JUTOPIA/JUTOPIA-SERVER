import { createLogger, format, transports } from "winston";
import moment from "moment-timezone";
import path from "path";

const { combine, printf } = format;

const customFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

const logger = createLogger({
  level: "info",
  format: combine(
    format.timestamp({
      format: () => moment().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss"),
    }),
    customFormat
  ),
  transports: [
    new transports.Console(),
    new transports.File({
      filename: path.join(__dirname, "logs", "combined.log"),
    }),
  ],
});

export default logger;
