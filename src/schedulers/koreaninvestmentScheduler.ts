import axios, { AxiosResponse } from "axios";
import cron from "node-cron";
import dotenv from "dotenv";
import fs from "fs";
import winston from "winston";

dotenv.config();

// Logger 설정
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.printf(
      ({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`
    )
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

// 사용자의 애플리케이션 키와 비밀 키 입력
const appKey: string = process.env.KOREAINVESTMENT_APP_KEY || "";
const appSecret: string = process.env.KOREAINVESTMENT_APP_SECRET || "";

// 한국투자증권 API의 기본 URL 설정
const urlBase: string = "https://openapi.koreainvestment.com:9443";

// 엔드포인트 경로 설정
const path: string = "/oauth2/tokenP";

// 완전한 URL 생성
const url: string = urlBase + path;

// 요청 데이터 인터페이스 정의
interface RequestData {
  grant_type: string;
  appkey: string;
  appsecret: string;
}

// 요청 데이터 설정
const data: RequestData = {
  grant_type: "client_credentials",
  appkey: appKey,
  appsecret: appSecret,
};

// 헤더 설정
const headers: Record<string, string> = {
  "Content-Type": "application/json",
};

// 요청 함수 정의
const sendRequest = () => {
  logger.info("[KIS] Sending request to obtain access token");
  axios
    .post(url, data, { headers: headers })
    .then((response: AxiosResponse) => {
      logger.info("Response received");
      logger.info(`Response Headers: ${JSON.stringify(response.headers)}`);
      logger.info(`Response Body: ${JSON.stringify(response.data)}`);

      // 응답 데이터에서 access_token을 .env 파일에 저장
      // 응답 데이터에서 access_token과 token_type을 조합하여 .env 파일에 저장
      const { access_token, token_type } = response.data;
      if (access_token && token_type) {
        const fullAccessToken = `${token_type} ${access_token}`;
        fs.writeFileSync("token.dat", `${fullAccessToken}`);
        logger.info("[KIS] Access token saved to token.dat file");
      }
    })
    .catch((error) => {
      if (error.response) {
        logger.error(`[KIS] Error Code: ${error.response.status}`);
        logger.error(
          `[KIS] Response Body: ${JSON.stringify(error.response.data)}`
        );
      } else {
        logger.error(`[KIS] Error: ${error.message}`);
      }
    });
};

// 매일 오전 7시 59분 59초에 작업을 실행하도록 스케줄링
// cron.schedule("* * * * *", () => {
cron.schedule("59 59 7 * * *", () => {
  logger.info("[KIS] Running scheduled task at 07:59:59");
  sendRequest();
});
