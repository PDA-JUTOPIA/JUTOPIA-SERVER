import createError from "http-errors";
import express, { Application, Request, Response, NextFunction } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import { initializeDatabase } from "./models";
import "./schedulers/marketIssueScheduler";
import "./schedulers/koreaninvestmentScheduler";
import compression from "compression";
import apiRouter from "./routes";
import bodyParser from "body-parser";

dotenv.config();

const app: Application = express();

app.use(logger("dev"));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(compression());

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://52.78.236.23",
      "http://jutopia.site",
    ], // 프론트엔드 서버의 주소를 여기에 넣습니다.
  })
);

app.use("/api", apiRouter);

app.get("/", async function (req, res) {
  res.send("Hello World!");
});

// 에러 핸들링 미들웨어
app.use((err: `Error`, req: Request, res: Response, next: NextFunction) => {
  // console.error(err.stack);
  res.status(500).send("Something broke!");
});

const PORT = process.env.PORT;
const url = process.env.DB_HOST;

const startServer = async () => {
  app.listen(PORT, async () => {
    try {
      await initializeDatabase();
    } catch (error) {
      console.error("Server startup failed:", error);
      return; // 데이터베이스 초기화 실패시 서버를 시작하지 않음
    }
    console.log(`Server running on ${url}:${PORT}`);
  });
};

export { startServer };
