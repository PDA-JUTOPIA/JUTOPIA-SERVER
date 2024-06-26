import { Request, Response, NextFunction } from "express";
import { Challenge } from "../models/challenge";
import { Op } from "sequelize";
import { getChallengesByEmail } from "./ChallengeParticipation";

export async function readChallenge(req: Request, res: Response) {
  try {
    const { challengeId } = req.params;

    const result = await Challenge.findOne({
      where: {
        challenge_id: challengeId,
      },
    });

    if (!result) {
      return res.status(400).json({ message: "challenge Not Found" });
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to read challenge" });
  }
}

export async function readChallengeByChallengeIds(req: Request, res: Response) {
  try {
    const { email } = req.body;
    if (typeof email !== "string") {
      return res.status(400).json({ message: "Invalid email parameter" });
    }

    // getChallengesByEmail 함수 호출하여 챌린지 ID 배열 얻기
    const challengeIds = await getChallengesByEmail(email);
    if (challengeIds.length === 0) {
      return res.status(404).json({ message: "No challenges found" });
    }

    // 챌린지 ID 배열을 사용하여 챌린지 객체들 조회
    const challenges = await Challenge.findAll({
      where: {
        challenge_id: {
          [Op.in]: challengeIds,
        },
      },
    });

    res.status(200).json(challenges);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch challenges", error });
  }
}

export async function readAllRecurit(req: Request, res: Response) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const result = await Challenge.findAll({
      where: {
        challenge_recurit_end: {
          [Op.gte]: today, // recurit_end가 오늘 날짜 이상인 챌린지를 찾습니다.
        },
      },
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: "Failed to login", error });
  }
}

export const setChallengeDirectory = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Setting challenge directory");
  req.query.directory = "challenge";
  next();
};

export async function createRecurit(req: Request, res: Response) {
  try {
    let pictureUrls: string[] = [];
    if (Array.isArray(req.files) && req.files.length > 0) {
      pictureUrls = (req.files as Express.MulterS3.File[]).map(
        (file) => file.location
      );
    } else {
      return res.status(400).send("IMAGE_NOT_EXIST");
    }
    console.log(req.body);
    const {
      challenge_name,
      challenge_detail,
      challenge_total,
      challenge_recurit_start,
      challenge_recurit_end,
      challenge_start,
      challenge_end,
    } = req.body;

    const newChallenge = await Challenge.create({
      challenge_name,
      challenge_detail,
      challenge_thumbnail: pictureUrls[0],
      challenge_total,
      challenge_recurit_start,
      challenge_recurit_end,
      challenge_start,
      challenge_end,
    });

    res.status(201).json({ result: "ok" });
  } catch (error) {
    res.status(500).json({ message: "Failed to create challenge", error });
  }
}
