import createError from "http-errors";
import express, { Application, Request, Response, NextFunction } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import { initializeDatabase } from "./models";
import marketIssueRouter from "./routes/marketIssues";

import apiRouter from "./routes";

dotenv.config();

const app: Application = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

app.use(
  cors({
    origin: "http://localhost:3000", // 프론트엔드 서버의 주소를 여기에 넣습니다.
  })
);

app.use("/api", apiRouter);

app.use("/shinhan/market-issue", marketIssueRouter); // '/shinhan/market-issue' 라우트를 marketIssueRouter로 설정

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
