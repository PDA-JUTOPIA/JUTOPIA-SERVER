import { Request, Response } from "express";
import axios from "axios";
import https from "https";
import fs from "fs";
const SSE = require("express-sse");

const instance = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
});

const appKey = process.env.KOREAINVESTMENT_APP_KEY as string;
const appSecret = process.env.KOREAINVESTMENT_APP_SECRET as string;
const authorization = fs.readFileSync("./token.dat", "utf-8").trim();

if (!appKey) {
  throw new Error(
    "KOREAINVESTMENT_APP_KEY is not defined in the environment variables."
  );
}
if (!appSecret) {
  throw new Error(
    "KOREAINVESTMENT_APP_SECRET is not defined in the environment variables."
  );
}
if (!authorization) {
  throw new Error(
    "KOREAINVESTMENT_AUTHORIZATION is not defined in the environment variables."
  );
}

const sse = new SSE();
let previousData: any = {};

interface StockParams {
  FID_COND_MRKT_DIV_CODE: string;
  FID_INPUT_ISCD: string;
}

interface StockResponse {
  [key: string]: any;
}

export const getDomesticStock = async (
  req: Request,
  res: Response
): Promise<void> => {
  sse.init(req, res); // SSE 초기화, 이 후에 res 객체를 직접 사용하지 않습니다.
  let isFirstConnection = true;
  const paramsList: StockParams[] = [
    { FID_COND_MRKT_DIV_CODE: "U", FID_INPUT_ISCD: "0001" }, //코스피
    { FID_COND_MRKT_DIV_CODE: "U", FID_INPUT_ISCD: "1001" }, //코스닥
    { FID_COND_MRKT_DIV_CODE: "U", FID_INPUT_ISCD: "2001" }, //코스피200
  ];

  const fetchData = async () => {
    try {
      const requests = paramsList.map((param) =>
        instance.get<StockResponse>(
          "https://openapi.koreainvestment.com:9443/uapi/domestic-stock/v1/quotations/inquire-index-price",
          {
            headers: {
              "Content-Type": "application/json",
              appKey: appKey,
              appSecret: appSecret,
              authorization: authorization,
              tr_id: "FHPUP02100000",
              custtype: "P",
            },
            params: param,
          }
        )
      );
      const responses = await Promise.all(requests);
      const responseData = responses.reduce((acc, response, index) => {
        const key = paramsList[index].FID_INPUT_ISCD;
        acc[key] = response.data;
        return acc;
      }, {} as StockResponse);

      // 첫 연결이거나 데이터가 변경된 경우에만 전송
      if (isFirstConnection || hasDataChanged(responseData)) {
        sse.send(responseData);
        previousData = { ...responseData };
        isFirstConnection = false;
      }
    } catch (error) {
      console.error("Error fetching data from Koreainvestment API", error);
      // res 객체를 직접 사용하지 않고 SSE 스트림을 통해 오류 메시지를 전송합니다.
      sse.send({ error: "Error fetching data from Koreainvestment API" });
    }
  };

  fetchData();
  const intervalId = setInterval(fetchData, 1000);
  req.on("close", () => clearInterval(intervalId));
};

const hasDataChanged = (currentData: StockResponse): boolean => {
  for (const key in currentData) {
    if (JSON.stringify(currentData[key]) !== JSON.stringify(previousData[key]))
      return true;
  }
  return false;
};
