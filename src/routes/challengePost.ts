import { Router } from "express";
import {
  createChallengePost,
  setChallengePostDirectory,
  deleteChallengePost,
} from "../controllers/ChallengePostController";
import { imageUploader } from "../middleware/image.uploader";

const router = Router();

router.post(
  "/:challengeId/add-post",
  (req, res, next) => {
    console.log("setChallengePostDirectory 미들웨어 실행");
    setChallengePostDirectory(req, res, next);
  },
  (req, res, next) => {
    console.log("imageUploader 미들웨어 실행");
    imageUploader.array("photos")(req, res, (err) => {
      if (err) {
        console.log("imageUploader 미들웨어에서 오류 발생:", err);
        return res
          .status(500)
          .json({ error: "이미지 업로드 실패", details: err.message });
      }
      next();
    });
  },
  (req, res, next) => {
    console.log("Request Params:", req.params);
    console.log("Request Body:", req.body);
    console.log("Request Files:", req.files);
    next();
  },
  createChallengePost
);

router.delete("/:challengeId/delete-post/:postId", deleteChallengePost);

export default router;
