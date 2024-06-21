import axios, { AxiosResponse, AxiosError } from "axios";

// 사용자의 애플리케이션 키와 비밀 키 입력
const appKey: string = process.env.KOREAINVESTMENT_APP_KEY as string;
const appSecret: string = process.env.KOREAINVESTMENT_APP_SECRET as string;

// 한국투자증권 API의 기본 URL 설정
const urlBase: string = "https://openapi.koreainvestment.com:9443";

// 엔드포인트 경로 설정
const path: string = "/oauth2/tokenP";

// 완전한 URL 생성
const url: string = urlBase + path;

// 요청 데이터 설정
const data: { grant_type: string; appkey: string; appsecret: string } = {
  grant_type: "client_credentials",
  appkey: appKey,
  appsecret: appSecret,
};

// 헤더 설정
const headers: { "Content-Type": string } = {
  "Content-Type": "application/json",
};

// POST 요청 보내기
axios
  .post(url, data, { headers: headers })
  .then((response: AxiosResponse) => {
    console.log("Response Body:", response.data);
  })
  .catch((error: AxiosError) => {
    if (error.response) {
      console.log("Error Code:", error.response.status);
      console.log("Response Body:", error.response.data);
    } else {
      console.log("Error:", error.message);
    }
  });
