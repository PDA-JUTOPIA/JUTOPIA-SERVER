import { Request, Response } from "express";
import { ChallengeParticipation } from "../models/challengeParticipation";
import { getUserIdByEmail } from "./UserController";

// 이메일을 통해 참여중인 challenge_id를 조회 => 배열로 리턴
export async function getChallengesByEmail(email: string): Promise<number[]> {
  try {
    if (typeof email !== "string") {
      throw new Error("Invalid email parameter");
    }

    const userId = await getUserIdByEmail(email);

    if (!userId) {
      throw new Error("User not found");
    }

    const challenges = await ChallengeParticipation.findAll({
      where: { user_id: userId },
      attributes: ["challenge_id"],
    });

    const challengeIds = challenges.map((challenge) => challenge.challenge_id);
    return challengeIds;
  } catch (error) {
    throw new Error("Failed to fetch challenge IDs");
  }
}

export async function joinChallenge(req: Request, res: Response) {
  try {
    const { email, challengeId } = req.body;
    const userId = await getUserIdByEmail(email);

    if (!userId) {
      return res.status(404).json({ message: "User not found" });
    }

    const cp = await ChallengeParticipation.create({
      is_challenge_end: false,
      challenge_participation_count: 0,
      user_id: userId,
      challenge_id: challengeId,
    });

    res.status(201).json({
      is_challenge_end: cp.is_challenge_end,
      challenge_participation_count: cp.challenge_participation_count,
      user_id: cp.user_id,
      challenge_id: cp.challenge_id,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to join challenge" });
  }
}
