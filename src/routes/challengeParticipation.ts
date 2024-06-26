import { Router } from "express";
import {
  getChallengesByEmail,
  joinChallenge,
  checkIsUserInChallenge,
} from "../controllers/ChallengeParticipation";

const router = Router();

// router.post("/user-challenges", getChallengesByEmail); // POST 요청으로 이메일 전달
router.post("/join", joinChallenge);
router.get("/checkJoin/:userId/:challengeId", checkIsUserInChallenge);

export default router;
