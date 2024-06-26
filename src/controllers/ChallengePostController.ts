import { Request, Response, NextFunction } from "express";
import { ChallengePost } from "../models/challengePost";
import { PostPhoto } from "../models/postPhoto";
import { ChallengeParticipation } from "../models/challengeParticipation";
import { sequelize } from "../models";

export const setChallengePostDirectory = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Setting challenge directory");
  req.query.directory = "challengePost";
  next();
};

// API 엔드포인트
export async function createChallengePost(req: Request, res: Response) {
  console.log("test");
  try {
    const { challenge_post_text, challenge_participation_id } = req.body;
    console.log("Challenge Post Text:", challenge_post_text);
    console.log("Challenge Participation ID:", challenge_participation_id);

    // challenge_participation_id가 유효한지 확인
    const participation = await ChallengeParticipation.findByPk(
      challenge_participation_id
    );
    console.log("Challenge Participation:", participation);

    if (!participation) {
      return res
        .status(404)
        .json({ message: "Challenge participation not found" });
    }

    // 트랜잭션 시작
    const transaction = await sequelize.transaction();

    try {
      // ChallengePost 생성
      const challengePost = await ChallengePost.create(
        {
          challenge_post_text,
          challenge_participation_id,
        },
        { transaction }
      );
      console.log("Created Challenge Post:", challengePost);

      // 이미지 업로드 설정
      const photos = req.files as Express.MulterS3.File[];
      console.log("Uploaded Photos:", photos);

      for (const photo of photos) {
        await PostPhoto.create(
          {
            challenge_post_id: challengePost.challenge_post_id,
            post_photo_url: photo.location,
          },
          { transaction }
        );
      }

      // 트랜잭션 커밋
      await transaction.commit();

      res.status(201).json({ message: "Challenge post created successfully" });
    } catch (error) {
      await transaction.rollback(); // 챌린지 포스트 생성 실패 시 트랜잭션 롤백
      if (error instanceof Error) {
        console.log("Transaction Error:", error.message);
        res.status(500).json({
          error: "Failed to create challenge post",
          details: error.message,
        });
      } else {
        console.log("Transaction Error:", error);
        res.status(500).json({
          error: "Failed to create challenge post",
          details: String(error),
        });
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log("Unexpected Error:", error.message);
      res.status(500).json({
        error: "An unexpected error occurred",
        details: error.message,
      });
    } else {
      console.log("Unexpected Error:", error);
      res.status(500).json({
        error: "An unexpected error occurred",
        details: String(error),
      });
    }
  }
}

// 포스팅 삭제 API 엔드포인트
export async function deleteChallengePost(req: Request, res: Response) {
  try {
    const { postId } = req.params;

    // 트랜잭션 시작
    const transaction = await sequelize.transaction();

    try {
      // 해당 포스트와 관련된 사진들을 삭제
      await PostPhoto.destroy({
        where: { challenge_post_id: postId },
        transaction,
      });

      // 포스트 삭제
      const deleteResult = await ChallengePost.destroy({
        where: { challenge_post_id: postId },
        transaction,
      });

      // 트랜잭션 커밋
      await transaction.commit();

      if (deleteResult === 0) {
        return res.status(404).json({ message: "Challenge post not found" });
      }

      res.status(200).json({ message: "Challenge post deleted successfully" });
    } catch (error) {
      await transaction.rollback(); // 삭제 실패 시 트랜잭션 롤백
      if (error instanceof Error) {
        console.log("Transaction Error:", error.message);
        res.status(500).json({
          error: "Failed to delete challenge post",
          details: error.message,
        });
      } else {
        console.log("Transaction Error:", error);
        res.status(500).json({
          error: "Failed to delete challenge post",
          details: String(error),
        });
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log("Unexpected Error:", error.message);
      res.status(500).json({
        error: "An unexpected error occurred",
        details: error.message,
      });
    } else {
      console.log("Unexpected Error:", error);
      res.status(500).json({
        error: "An unexpected error occurred",
        details: String(error),
      });
    }
  }
}
