import dotenv from "dotenv";
import { S3Client } from "@aws-sdk/client-s3";
import multer from "multer";
import multerS3 from "multer-s3";
import { createUUID } from "./uuid";
import path from "path";
import { Request } from "express";

dotenv.config();

const s3 = new S3Client({
  region: process.env.AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY || "",
    secretAccessKey: process.env.AWS_S3_SECRET_KEY || "",
  },
});

// 확장자 검사 목록
const allowedExtensions = [".png", ".jpg", ".jpeg", ".bmp", ".gif"];

export const imageUploader = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET_NAME || "",
    contentType: multerS3.AUTO_CONTENT_TYPE, // Content-type, 자동으로 찾도록 설정
    key: (
      req: Request,
      file: Express.Multer.File,
      callback: (error: any, key?: string) => void
    ) => {
      // 파일명
      const uploadDirectory = req.query.directory ?? ""; // 디렉토리 path 설정을 위해서
      const extension = path.extname(file.originalname); // 파일 이름 얻어오기
      const uuid = createUUID(); // UUID 생성

      // extension 확인을 위한 코드 (확장자 검사용)
      if (!allowedExtensions.includes(extension)) {
        return callback(new Error("WRONG_EXTENSION"));
      }
      callback(null, `${uploadDirectory}/${uuid}_${file.originalname}`);
    },
    // acl: "public-read-write", // 파일 액세스 권한
  }),
  // 이미지 용량 제한 (20MB)
  limits: { fileSize: 20 * 1024 * 1024 },
});
