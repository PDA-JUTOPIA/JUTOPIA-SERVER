import { Request, Response } from "express";
import { Challenge } from "../models/challenge";
import { Op } from "sequelize";

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
