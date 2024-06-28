import { Request, Response } from "express";
import { ChallengeParticipation } from "../models/challengeParticipation";
import { getUserIdByEmail } from "./UserController";

export async function checkIsUserInChallenge(req: Request, res: Response) {
  try {
    const { userId, challengeId } = req.params;

    const cp = await ChallengeParticipation.findOne({
      where: {
        user_id: userId,
        challenge_id: challengeId,
      },
    });

    if (!cp) {
      res.status(200).json({ status: false });
    } else {
      res.status(200).json({ status: true });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to read challenge" });
  }
}

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

// challenge_participation_id를 통해 user_id를 조회하여 리턴
export async function getUserIdByParticipationId(req: Request, res: Response) {
  try {
    const { challenge_participation_id } = req.body;

    if (typeof challenge_participation_id !== "number") {
      return res
        .status(400)
        .json({ message: "Invalid challenge_participation_id parameter" });
    }

    const participation = await ChallengeParticipation.findOne({
      where: { challenge_participation_id },
      attributes: ["user_id"],
    });

    if (!participation) {
      return res.status(404).json({ message: "Participation not found" });
    }

    res.status(200).json({ user_id: participation.user_id });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch user ID by participation ID" });
  }
}

// challenge_id를 통해 참여중인 challenge_participation_id를 조회 => 배열로 리턴
export async function getParticipationIdByChallengeId(
  challenge_id: number
): Promise<number[]> {
  try {
    const participations = await ChallengeParticipation.findAll({
      where: {
        challenge_id: challenge_id,
      },
      attributes: ["challenge_participation_id"],
    });

    return participations.map(
      (participation) => participation.challenge_participation_id
    );
  } catch (error) {
    console.error("Error:", error);
    throw new Error("Failed to fetch participation IDs by challenge ID");
  }
}

// user_id를 통해 challenge_participation_count 더하기 => integer 리턴
export async function getParticipationCountByEmail(
  req: Request,
  res: Response
) {
  try {
    const { email } = req.params;
    if (typeof email !== "string") {
      return res.status(400).json({ error: "Invalid email parameter" });
    }

    const userId = await getUserIdByEmail(email);

    if (!userId) {
      return res.status(404).json({ error: "User not found" });
    }

    const challenges = await ChallengeParticipation.findAll({
      where: { user_id: userId },
      attributes: ["challenge_participation_count"],
    });

    let totalParticipationCount = 0;
    if (challenges.length > 0) {
      totalParticipationCount = challenges
        .map((challenge) => challenge.challenge_participation_count)
        .reduce((acc, count) => acc + count, 0);
    }

    console.log(totalParticipationCount);
    return res.status(200).json({ totalParticipationCount });
  } catch (error) {
    console.error("Error:", error); // 상세 오류 메시지를 로그로 출력합니다.
    return res.status(500).json({
      error: "Failed to fetch totalParticipationCount",
      details: (error as any).message,
    });
  }
}
