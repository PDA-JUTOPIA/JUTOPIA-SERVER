import { Request, Response } from "express";
import axios from "axios";
import https from "https";
import fs from "fs";

const instance = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
});

const appKey = process.env.KOREAINVESTMENT_APP_KEY as string;
const appSecret = process.env.KOREAINVESTMENT_APP_SECRET as string;
const authorization = fs.readFileSync("./token.dat", "utf-8");

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

export const getDomesticStock = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const paramsList = [
      { FID_COND_MRKT_DIV_CODE: "U", FID_INPUT_ISCD: "0001" }, //코스피
      { FID_COND_MRKT_DIV_CODE: "U", FID_INPUT_ISCD: "1001" }, //코스닥
      { FID_COND_MRKT_DIV_CODE: "U", FID_INPUT_ISCD: "2001" }, //코스피200
    ];
    const requests = paramsList.map((param) =>
      instance
        .get(
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
        .then((response) => ({
          [param.FID_INPUT_ISCD]: response.data,
        }))
    );
    const koreainvestmentResponses = await Promise.all(requests);
    const responseData = Object.assign({}, ...koreainvestmentResponses);
    res.json(responseData);
  } catch (error) {
    console.error("Error fetching data from Koreainvestment API", error);
    res
      .status(500)
      .json({ error: "Error fetching data from Koreainvestment API" });
  }
};
