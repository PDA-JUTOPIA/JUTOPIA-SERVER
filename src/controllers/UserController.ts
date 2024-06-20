import { Request, Response, response } from "express";
import { User } from "../models/user";
import { createToken, verifyToken } from "../utils/auth";
import bcrypt from "bcryptjs";

export async function createUser(req: Request, res: Response) {
  console.log(req.body);

  try {
    const { username, email, password } = req.body;
    console.log(username, email, password);

    // 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, 10); // 10은 해시 라운드 수입니다.

    // 이미 등록된 이메일인지 확인
    const existingUser = await User.findOne({
      where: {
        email: email,
      },
    });
    console.log(existingUser);

    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: "Failed to register user", error });
  }
}

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // 사용자가 존재하는지 확인
    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // 비밀번호 일치 확인
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // JWT 생성 및 반환
    const token = createToken({ user_id: user.user_id, email: user.email });
    const username = user.username;

    res.status(200).json({ token, username, email });
  } catch (error) {
    res.status(400).json({ message: "Failed to login", error });
  }
};

export async function readSinceJoinDate(req: Request, res: Response) {
  try {
    const { email } = req.params;

    // 이미 등록된 이메일인지 확인
    const existingUser = await User.findOne({
      where: {
        email: email,
      },
    });

    if (!existingUser) {
      return res.status(400).json({ message: "User Not Found" });
    }

    const joinDate = new Date(existingUser.createdAt);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate.getTime() - joinDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    res.status(200).json({ daysSinceJoined: diffDays });
  } catch (error) {
    res.status(500).json({ error: "Failed to calculate days since joined" });
  }
}
