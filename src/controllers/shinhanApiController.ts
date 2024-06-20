import { Request, Response } from "express";
import axios from "axios";
import https from "https";
import { Op } from "sequelize";
import { ColumnBoard } from "../models/columnBoard";
import { sequelize } from "../models";
import logger from "../logger";

export interface MarketIssue {
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

export const fetchAndStoreMarketIssues = async (): Promise<void> => {
  try {
    logger.info("Fetching market issues from Shinhan API");
    const shinhanResponse = await instance.get(
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

    const issues: MarketIssue[] = shinhanResponse.data.dataBody.list;

    // DB에서 기존 데이터를 조회
    const existingIssues = await ColumnBoard.findAll({
      attributes: ["bbs_name", "title", "reg_date"],
      where: {
        title: {
          [Op.in]: issues.map((issue) => issue.title),
        },
        reg_date: {
          [Op.in]: issues.map((issue) => new Date(issue.regDate)),
        },
      },
    });

    // 중복 여부 확인
    const newIssues = issues.filter((issue) => {
      return !existingIssues.some(
        (existingIssue) =>
          existingIssue.title === issue.title &&
          existingIssue.reg_date.getTime() === new Date(issue.regDate).getTime()
      );
    });

    // 중복되지 않은 데이터 삽입
    for (const issue of newIssues) {
      await ColumnBoard.create({
        bbs_name: issue.bbsName,
        title: issue.title,
        writer: issue.writer,
        reg_date: new Date(issue.regDate),
        attachment_url: issue.attachmentUrl,
        content: issue.content,
      });
      logger.info(
        `Stored new issue: ${issue.title} ${issue.writer} ${issue.regDate}`
      );
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
