import { User } from "./user";
import { Challenge } from "./challenge";
import { Problem } from "./problem";
import { UserProblem } from "./userProblem";
import { ChallengeParticipation } from "./challengeParticipation";
import { ChallengeReview } from "./challengeReview";
import { ChallengePost } from "./challengePost";
import { PostPhoto } from "./postPhoto";
import { ChallengePostComment } from "./challengePostComment";
import { Reward } from "./reward";
import { UserReward } from "./userReward";
import { UserCurrentLearning } from "./userCurrentLearning";

import sequelize from "../config/db";
import { Sequelize } from "sequelize-typescript";

export interface DB {
  sequelize: Sequelize;
  Sequelize: typeof Sequelize;
}

export const db: Partial<DB> = {
  sequelize,
  Sequelize,
};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// 모든 모델을 등록
sequelize.addModels([
  User,
  Challenge,
  Problem,
  UserProblem,
  ChallengeParticipation,
  ChallengeReview,
  ChallengePost,
  PostPhoto,
  ChallengePostComment,
  Reward,
  UserReward,
  UserCurrentLearning,
]);

export const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    await sequelize.sync({ force: true }); // 데이터베이스와 모델 동기화
    console.log("Database synchronized successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    throw error; // 에러를 던져서 서버 시작을 중단시킬 수 있음
  }
};
