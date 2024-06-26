import { Router } from "express";
import {
  createComment,
  readCommentList,
  deleteComment,
} from "../controllers/ChallengePostCommentController";

const router = Router();

router.post("/addComment", createComment);
router.get("/readComment/:challengePostId", readCommentList);
router.delete("/deleteComment/:challengePostCommentId", deleteComment);

export default router;
