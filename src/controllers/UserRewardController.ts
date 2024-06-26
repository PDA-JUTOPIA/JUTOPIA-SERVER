import { Request, Response } from "express";
import { User } from "../models/user";
import { UserReward } from "../models/userReward";

export async function createUserReward(req: Request, res: Response) {
  const { email, reward_id } = req.body;
  const existingUser = await User.findOne({
    where: {
      email: email,
    },
  });

  if (!existingUser) {
    throw new Error("User Not Found");
  }

  console.log("user id: ", existingUser.user_id);
  console.log("reward_id: ", reward_id);

  const currentDate = new Date();
  const userReward = await UserReward.create({
    user_reward_date: currentDate,
    reward_id: reward_id + 1,
    user_id: existingUser.user_id,
  });

  return userReward;
}

export async function readUserReward(req: Request, res: Response) {
  try {
    const { email } = req.params;
    const existingUser = await User.findOne({
      where: {
        email: email,
      },
    });

    if (!existingUser) {
      return res.status(400).json({ message: "User Not Found" });
    }

    const userRewards = await UserReward.findAll({
      where: {
        user_id: existingUser.user_id,
      },
    });

    if (!userRewards || userRewards.length === 0) {
      return res.status(200).json({
        userRewardIds: [],
        message: "No rewards found for this user.",
      });
    }

    const rewardIds = userRewards.map((reward) => reward.reward_id);

    res.status(200).json({
      userRewardIds: rewardIds,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        error: "Failed to read userReward",
        message: error.message,
      });
    } else {
      res.status(500).json({
        error: "Failed to read userReward",
        message: "An unknown error occurred",
      });
    }
  }
}
