import { Request, Response, response } from "express";
import { User } from "../models/user";
import { UserCurrentLearning } from "../models/userCurrentLearning";
import { createToken, verifyToken } from "../utils/auth";
import { ChallengeParticipation } from "../models/challengeParticipation";
import { ChallengePost } from "../models/challengePost";
import { Op } from "sequelize";

import bcrypt from "bcryptjs";

export async function createUser(req: Request, res: Response) {
  try {
    const { username, email, password } = req.body;

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
    res.status(201).json({ username: user.username, email: user.email });
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

export async function updateUsername(req: Request, res: Response) {
  try {
    const { newName, email } = req.body;

    const existingUser = await User.findOne({
      where: {
        email: email,
      },
    });
    if (!existingUser) {
      return res.status(400).json({ message: "User Not Found" });
    }

    existingUser.username = newName;
    await existingUser.save();

    res.status(200).json({ newName: existingUser.username });
  } catch (error) {
    res.status(500).json({ error: "Failed to update Username" });
  }
}

// 사용자 ID 조회 함수
async function getUserIdByEmail(email: string): Promise<number | null> {
  try {
    const user = await User.findOne({
      where: { email: email },
      attributes: ["user_id"],
    });

    if (user) {
      return user.user_id;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching user by email:", error);
    throw error;
  }
}

export async function getUsernameById(userId: number) {
  try {
    const user = await User.findOne({
      where: { user_id: userId },
    });
    if (user) {
      return user.username;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching user by email:", error);
    throw error;
  }
}

// 이메일로 사용자 ID 조회
export async function getUserId(req: Request, res: Response) {
  try {
    const { email } = req.body;
    console.log(req.body);
    if (typeof email !== "string") {
      return res.status(400).json({ message: "Invalid email parameter" });
    }

    const userId = await getUserIdByEmail(email);
    if (userId) {
      res.status(200).json({ userId });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user ID" });
  }
}
export { getUserIdByEmail };

// user id를 구한 뒤 USER_CURRENT_LEARNING테이블에서 USER_ID를 기준으로 USER_LEARNING컬럼 값을 받아온 뒤 맵핑값 반환
const userLearningMap: { [key: string]: string } = {
  "0": "공부할 마음먹기",
  "1": "UNIT1-1",
  "2": "UNIT1-2",
  "3": "UNIT1-3",
  "4": "UNIT1-리워드 획득",
  "5": "UNIT2-1",
  "6": "UNIT2-2",
  "7": "UNIT2-3",
  "8": "UNIT2-4",
  "9": "UNIT2-5",
  "10": "UNIT2-리워드 획득",
  "11": "UNIT3-1",
  "12": "UNIT3-2",
  "13": "UNIT3-3",
  "14": "UNIT3-4",
  "15": "UNIT3-5",
  "16": "UNIT3-6",
  "17": "UNIT3-7",
  "18": "UNIT3-리워드 획득",
  "19": "UNIT4-1",
  "20": "UNIT4-2",
  "21": "UNIT4-3",
  "22": "UNIT4-리워드획득",
};

export async function getUserLearningStatus(req: Request, res: Response) {
  try {
    const { email } = req.body;

    // 사용자 ID 조회
    const userId = await getUserIdByEmail(email);
    if (!userId) {
      return res.status(404).json({ message: "User not found" });
    }

    // USER_CURRENT_LEARNING 테이블에서 current_learning 조회
    const userCurrentLearning = await UserCurrentLearning.findOne({
      where: { user_id: userId },
      attributes: ["current_learning"],
    });

    if (!userCurrentLearning) {
      return res
        .status(404)
        .json({ message: "Learning status not found for user" });
    }

    const userLearningCount = userCurrentLearning.current_learning;

    // current_learning 값을 이용해 맵핑 값 반환
    const learningStatus = userLearningMap[userLearningCount.toString()];

    if (!learningStatus) {
      return res.status(400).json({ message: "Invalid learning count" });
    }

    res.status(200).json({ learningStatus });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user learning status" });
  }
}

// User 테이블에서 유저 email을 통해 userid를 조회하고, userID로 challenge participation id를 조회한 뒤
// challenge 테이블에서 user의 participation 페이지가 일치하는 행을 찾아서 등록일을 받아와서
// 주마다 일요일에서 토요일에 등록일이 잇는지 조회한 후 [일요일, 월요일, 화요일,  수요일, 목요일, 금요일, 토요일] 배열에 True False 값을 먹여서 반환하기
function getStartOfWeek(date: Date): Date {
  const startOfWeek = new Date(date);
  const day = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - day; // Adjust to Sunday
  startOfWeek.setDate(diff);
  startOfWeek.setHours(0, 0, 0, 0);
  return startOfWeek;
}

function getEndOfWeek(date: Date): Date {
  const endOfWeek = new Date(date);
  const startOfWeek = getStartOfWeek(date);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);
  return endOfWeek;
}

export async function getPostIdsByEmailAndChallenge(
  req: Request,
  res: Response
) {
  try {
    const { email } = req.body; // email을 body에서 가져옴
    console.log("User Email:", email);

    // email을 통해 userId 가져오기
    const userId = await getUserIdByEmail(email);
    console.log("User ID:", userId);
    if (!userId) {
      return res.status(404).json({ message: "User not found" });
    }

    // challengeId와 userId를 통해 challenge participation id 조회
    const participation = await ChallengeParticipation.findOne({
      where: {
        user_id: userId,
      },
      attributes: ["challenge_participation_id"],
    });
    console.log("Participation:", participation);

    if (!participation) {
      return res
        .status(404)
        .json({ message: "Challenge participation not found" });
    }

    const challengeParticipationId = participation.challenge_participation_id;
    console.log("Challenge Participation ID:", challengeParticipationId);

    // 현재 주의 시작과 끝 날짜 계산
    const today = new Date();
    const startOfWeek = getStartOfWeek(today);
    const endOfWeek = getEndOfWeek(today);
    console.log("Start of Week:", startOfWeek);
    console.log("End of Week:", endOfWeek);

    // CHALLENGE_POST 테이블에서 현재 주의 시작과 끝 날짜 사이에 있는 모든 행 조회 (createdAt 순으로 내림차순 정렬)
    const posts = await ChallengePost.findAll({
      where: {
        challenge_participation_id: challengeParticipationId,
        challenge_post_date: {
          [Op.between]: [startOfWeek, endOfWeek],
        },
      },
      attributes: ["challenge_post_date"],
      order: [["challenge_post_date", "DESC"]],
    });
    console.log("Posts:", posts);

    // 주마다 일요일에서 토요일에 등록일이 있는지 확인
    const weekDays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const postDates = posts.map((post) => new Date(post.challenge_post_date));
    console.log("Post Dates:", postDates);

    const result = weekDays.map((day, index) => {
      return postDates.some((date) => date.getDay() === index);
    });

    console.log("Result:", result);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error:", error); // 상세 오류 메시지를 로그로 출력합니다.
    res.status(500).json({
      error: "Failed to fetch user learning status",
      details: (error as any).message,
    });
  }
}
