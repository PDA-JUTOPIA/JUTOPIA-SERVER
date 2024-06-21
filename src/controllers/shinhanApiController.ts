import { Request, Response } from "express";
import axios from "axios";
import https from "https";
import { Op } from "sequelize";
import { ColumnBoard } from "../models/columnBoard";

import logger from "../logger";
import moment from "moment-timezone";

export interface ColumnList {
  bbsName: string;
  title: string;
  regDate: string;
  messageId: string;
  attachmentUrl: string;
  content: string;
  viewCount: string;
  writer: string;
}

const instance = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
});

const apiKeyValue = process.env.API_KEY_VALUE as string;

if (!apiKeyValue) {
  throw new Error("API_KEY_VALUE is not defined in the environment variables.");
}

const fetchMarketIssues = async (): Promise<ColumnList[]> => {
  const response = await instance.get(
    "https://gapi.shinhansec.com:8443/openapi/v1.0/strategy/market-issue",
    {
      headers: {
        apiKey: apiKeyValue,
        "Access-Control-Allow-Origin": "*",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36",
      },
    }
  );
  return response.data.dataBody.list.map((item: any) => ({
    bbsName: item.bbsName,
    title: item.title,
    regDate: item.regDate,
    messageId: item.messageId,
    attachmentUrl: item.attachmentUrl,
    content: item.content,
    viewCount: item.viewCount,
    writer: item.writer,
  }));
};

const fetchInvestStrategies = async (): Promise<ColumnList[]> => {
  const response = await instance.get(
    "https://gapi.shinhansec.com:8443/openapi/v1.0/strategy/invest",
    {
      headers: {
        apiKey: apiKeyValue,
        "Access-Control-Allow-Origin": "*",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36",
      },
    }
  );
  return response.data.dataBody.list.map((item: any) => ({
    bbsName: item.bbs_name,
    title: item.title,
    regDate: item.reg_date,
    messageId: item.message_id,
    attachmentUrl: item.attachment_url,
    content: item.content,
    viewCount: item.view_count,
    writer: item.writer,
  }));
};

export const fetchAndStoreMarketIssues = async (): Promise<void> => {
  try {
    logger.info("Fetching market issues from Shinhan API");
    const marketIssues = await fetchMarketIssues();
    logger.info(
      `Fetched ${marketIssues.length} market issues from Shinhan API`
    ); // API 호출 후 받아온 데이터 개수 로그

    logger.info("Fetching investment strategies from Shinhan API");
    const investStrategies = await fetchInvestStrategies();
    logger.info(
      `Fetched ${investStrategies.length} investment strategies from Shinhan API`
    ); // API 호출 후 받아온 데이터 개수 로그

    const allIssues = [...marketIssues, ...investStrategies];

    // DB에서 기존 데이터를 조회
    const existingIssues = await ColumnBoard.findAll({
      attributes: ["bbs_name", "title", "reg_date"],
      where: {
        title: {
          [Op.in]: allIssues.map((issue) => issue.title),
        },
        reg_date: {
          [Op.in]: allIssues.map((issue) =>
            moment(issue.regDate, "YYYY.MM.DD").toDate()
          ), // 날짜 형식 변환
        },
      },
    });

    logger.info(
      `Found ${existingIssues.length} existing issues in the database`
    ); // 기존 데이터베이스에서 조회된 데이터 개수 로그

    // 중복 여부 확인
    const newIssues = allIssues.filter((issue) => {
      return !existingIssues.some((existingIssue) => {
        const existingDate = moment(existingIssue.reg_date).format(
          "YYYY.MM.DD"
        ); // 날짜 문자열 변환
        return (
          existingIssue.title === issue.title && existingDate === issue.regDate
        );
      });
    });

    logger.info(
      `Found ${newIssues.length} new issues to be stored in the database`
    ); // 중복되지 않는 새로운 데이터 개수 로그

    // 중복되지 않은 데이터 삽입
    for (const issue of newIssues) {
      await ColumnBoard.create({
        bbs_name: issue.bbsName,
        title: issue.title,
        writer: issue.writer,
        reg_date: moment(issue.regDate, "YYYY.MM.DD").toDate(), // 날짜 형식 변환
        attachment_url: issue.attachmentUrl,
        content: issue.content,
      });
      logger.info(
        `Stored new issue: ${issue.title} ${issue.writer} ${issue.regDate}`
      ); // 삽입된 데이터 로그
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error("Error fetching data from Shinhan API: " + error.message);
    } else {
      logger.error("Unknown error occurred");
    }
  }
};

// Express route handler for testing
export const getMarketIssues = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    logger.info("Manual trigger to fetch market issues");
    await fetchAndStoreMarketIssues();
    res.json({ message: "Data fetched and stored successfully" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error("Error fetching data from Shinhan API: " + error.message);
      res.status(500).json({ error: "Error fetching data from Shinhan API" });
    } else {
      logger.error("Unknown error occurred");
      res.status(500).json({ error: "Unknown error occurred" });
    }
  }
};
