import { Router } from "express";
import {
  createComment,
  readCommentList,
  deleteComment,
  updateComment,
} from "../controllers/ChallengePostCommentController";

const router = Router();

router.post("/addComment", createComment);
router.get("/readComment/:challengePostId", readCommentList);
router.delete("/deleteComment/:challengePostCommentId", deleteComment);
router.put("/updateComment", updateComment);

export default router;
