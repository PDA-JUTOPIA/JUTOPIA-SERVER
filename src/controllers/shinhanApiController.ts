import { Request, Response } from "express";
import axios from "axios";
import https from "https";

const instance = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
});

const apiKeyValue = process.env.API_KEY_VALUE as string;

if (!apiKeyValue) {
  throw new Error("API_KEY_VALUE is not defined in the environment variables.");
}

export const getMarketIssues = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
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
    res.json(shinhanResponse.data);
  } catch (error) {
    console.error("Error fetching data from Shinhan API", error);
    res.status(500).json({ error: "Error fetching data from Shinhan API" });
  }
};
