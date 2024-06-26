import { Request, Response } from "express";
import { UserReward } from "../models/userReward";
import { Reward } from "../models/reward";

export async function readRewards(req: Request, res: Response) {
  try {
    const rewards = await Reward.findAll();
    res.status(200).json(rewards);
  } catch (error) {
    console.error("Failed to retrieve rewards:", error);
    res.status(500).json({
      error: "Failed to retrieve rewards",
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
    });
  }
}

export async function readRewardOne(req: Request, res: Response) {
  try {
    const { reward_id } = req.params;
    const reward = await UserReward.findOne({
      where: {
        reward_id: reward_id,
      },
    });

    if (!reward) {
      return res.status(400).json({ message: "Reward Not Found" });
    }

    res.status(200).json({
      reward: reward,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        error: "Failed to read Reward",
        message: error.message,
      });
    } else {
      res.status(500).json({
        error: "Failed to read Reward",
        message: "An unknown error occurred",
      });
    }
  }
}
