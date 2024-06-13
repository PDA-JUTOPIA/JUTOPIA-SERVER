import { Request, Response } from "express";
import { User } from "../models/user";

export const createUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.create({ username, email, password });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: "Failed to register user", error });
  }
};
