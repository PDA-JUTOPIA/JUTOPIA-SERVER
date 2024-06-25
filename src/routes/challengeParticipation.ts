import { Router } from "express";
import {
  getChallengesByEmail,
  getParticipationId,
} from "../controllers/ChallengeParticipation";

const router = Router();

router.post("/user-challenges", getChallengesByEmail); // POST 요청으로 이메일 전달
router.post("/participation-id", getParticipationId); // POST 요청으로 이메일과 challenge_id 전달

export default router;
