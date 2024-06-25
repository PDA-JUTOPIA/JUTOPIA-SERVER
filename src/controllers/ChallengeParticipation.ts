import { Request, Response } from "express";
import { ChallengeParticipation } from "../models/challengeParticipation";
import { getUserIdByEmail } from "./UserController";

// 이메일을 통해 참여중인 challenge_id를 조회 => 배열로 리턴
export async function getChallengesByEmail(req: Request, res: Response) {
  try {
    const { email } = req.body;
    if (typeof email !== "string") {
      return res.status(400).json({ message: "Invalid email parameter" });
    }

    const userId = await getUserIdByEmail(email);
    console.log(userId);

    if (!userId) {
      return res.status(404).json({ message: "User not found" });
    }

    const challenges = await ChallengeParticipation.findAll({
      where: { user_id: userId },
      attributes: ["challenge_id"],
    });

    const challengeIds = challenges.map((challenge) => challenge.challenge_id);
    res.status(200).json({ challengeIds });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch challenge IDs" });
  }
}

// 이메일과 challenge_id를 통해 참여중인 challenge_participation_id를 조회 => 배열로 리턴
export async function getParticipationId(req: Request, res: Response) {
  try {
    const { email, challenge_id } = req.body;
    if (typeof email !== "string" || typeof challenge_id !== "number") {
      return res
        .status(400)
        .json({ message: "Invalid email or challenge_id parameter" });
    }

    const userId = await getUserIdByEmail(email);
    console.log(`${userId}  ${email}   ${challenge_id}`);
    if (!userId) {
      console.log;
      return res.status(404).json({ message: "User not found" });
    }

    const participations = await ChallengeParticipation.findAll({
      where: {
        user_id: userId,
        challenge_id: challenge_id,
      },
      attributes: ["challenge_participation_id"],
    });

    const participationIds = participations.map(
      (participation) => participation.challenge_participation_id
    );
    res.status(200).json({ participationIds });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch challenge participation IDs" });
  }
}
