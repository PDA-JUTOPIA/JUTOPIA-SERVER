import { Request, Response, NextFunction } from "express";
import { Challenge } from "../models/challenge";
import { Op } from "sequelize";
import { imageUploader } from "../middleware/image.uploader";

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
  console.log("!1111111");
  try {
    let pictureUrls: string[] = [];
    if (Array.isArray(req.files) && req.files.length > 0) {
      pictureUrls = (req.files as Express.MulterS3.File[]).map(
        (file) => file.location
      );
    } else {
      return res.status(400).send("IMAGE_NOT_EXIST");
    }
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

    res.status(201).json(newChallenge);
  } catch (error) {
    res.status(500).json({ message: "Failed to create challenge", error });
  }
}
