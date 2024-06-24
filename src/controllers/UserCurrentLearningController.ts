import { Request, Response } from "express";
import { User } from "../models/user";
import { UserCurrentLearning } from "../models/userCurrentLearning";

//create
export async function createUserCurrentLearning(req: Request, res: Response) {
  console.log(req.body);

  try {
    const { email } = req.body;

    const existingUser = await User.findOne({
      where: {
        email: email,
      },
    });

    if (!existingUser) {
      return res.status(400).json({ message: "User Not Found" });
    }

    const currentDate = new Date();
    const userCurrentLearning = await UserCurrentLearning.create({
      completeDate: currentDate,
      current_learning: 0, //lessonCompleted
      user_id: existingUser.user_id,
    });
    res
      .status(201)
      .json({ current_learning: userCurrentLearning.current_learning });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Failed to create user_current_learning", error });
  }
}

//조회
export async function readUserCurrentLearning(req: Request, res: Response) {
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

    const userCurrentLearning = await UserCurrentLearning.findOne({
      where: {
        user_id: existingUser.user_id,
      },
    });

    if (!userCurrentLearning) {
      return res.status(404).json({ message: "UserCurrentLearning Not Found" });
    }
    res
      .status(200)
      .json({ userCurrentLearning: userCurrentLearning.current_learning });
  } catch (error) {
    res.status(500).json({ error: "Failed to read user_current_learning" });
  }
}

//update
export async function updateUserCurrentLearning(req: Request, res: Response) {
  try {
    const { email, newCurrent_learning } = req.body;

    const existingUser = await User.findOne({
      where: {
        email: email,
      },
    });
    if (!existingUser) {
      return res.status(400).json({ message: "User Not Found" });
    }

    const userCurrentLearning = await UserCurrentLearning.findOne({
      where: {
        user_id: existingUser.user_id,
      },
    });
    console.log(UserCurrentLearning);

    if (userCurrentLearning) {
      userCurrentLearning.current_learning = newCurrent_learning;
      userCurrentLearning.completeDate = new Date();
      await userCurrentLearning.save();
    }

    res
      .status(200)
      .json({ newCurrent_learning: userCurrentLearning?.current_learning });
  } catch (error) {
    res.status(500).json({ error: "Failed to update User_Current_Learning" });
  }
}
