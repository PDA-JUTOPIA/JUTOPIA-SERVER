import { Router } from "express";
import { getChallengesByEmail } from "../controllers/ChallengeParticipation";

const router = Router();

router.post("/user-challenges", getChallengesByEmail); // POST 요청으로 이메일 전달
export default router;
