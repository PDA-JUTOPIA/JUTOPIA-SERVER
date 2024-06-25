import { Request, Response, NextFunction } from "express";
import { ChallengePost } from "../models/challengePost";
import { PostPhoto } from "../models/postPhoto";
import { ChallengeParticipation } from "../models/challengeParticipation";
import { sequelize } from "../models"; // Sequelize 인스턴스를 가져옵니다

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

export async function updateChallengePost(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { challenge_post_text, challenge_participation_id } = req.body;
    const { postId } = req.params;
    console.log("Challenge Post Text:", challenge_post_text);
    console.log("Challenge Participation ID:", challenge_participation_id);
    console.log("Post ID:", postId);

    // 포스트가 존재하는지 확인
    const challengePost = await ChallengePost.findByPk(postId);
    if (!challengePost) {
      return res.status(404).json({ message: "Challenge post not found" });
    }

    // 트랜잭션 시작
    const transaction = await sequelize.transaction();

    try {
      // 포스트 업데이트
      challengePost.challenge_post_text = challenge_post_text;
      challengePost.challenge_participation_id = challenge_participation_id;
      await challengePost.save({ transaction });

      // 이미지 업로드 설정
      const photos = req.files as Express.MulterS3.File[];
      if (photos && photos.length > 0) {
        // 기존 이미지 삭제
        await PostPhoto.destroy({
          where: { challenge_post_id: challengePost.challenge_post_id },
          transaction,
        });

        // 새로운 이미지 저장
        for (const photo of photos) {
          await PostPhoto.create(
            {
              challenge_post_id: challengePost.challenge_post_id,
              post_photo_url: photo.location,
            },
            { transaction }
          );
        }
      }

      // 트랜잭션 커밋
      await transaction.commit();

      res.status(200).json({ message: "Challenge post updated successfully" });
    } catch (error) {
      await transaction.rollback(); // 포스트 업데이트 실패 시 트랜잭션 롤백
      if (error instanceof Error) {
        console.log("Transaction Error:", error.message);
        res.status(500).json({
          error: "Failed to update challenge post",
          details: error.message,
        });
      } else {
        console.log("Transaction Error:", error);
        res.status(500).json({
          error: "Failed to update challenge post",
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
