import { Request, Response, NextFunction } from "express";
import { ChallengePost } from "../models/challengePost";
import { PostPhoto } from "../models/postPhoto";
import { ChallengeParticipation } from "../models/challengeParticipation";
import { sequelize } from "../models";
import { getUserIdByEmail, getUsernameById } from "./UserController"; // 사용자 이메일을 통해 user_id를 찾는 함수 import
import { getParticipationIdByChallengeId } from "./ChallengeParticipation";
import { Op } from "sequelize";

export const setChallengePostDirectory = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Setting challenge directory");
  req.query.directory = "challengePost";
  next();
};

// 포스팅 생성 API 엔드포인트
export async function createChallengePost(req: Request, res: Response) {
  console.log("test");
  try {
    const { challenge_post_text, challenge_id, email } = req.body;
    console.log("Challenge Post Text:", challenge_post_text);
    console.log("Challenge ID:", challenge_id);
    console.log("User Email:", email);

    // email을 통해 userId 가져오기
    const userId = await getUserIdByEmail(email);
    if (!userId) {
      return res.status(404).json({ message: "User not found" });
    }

    // challengeId와 userId를 통해 challenge participation id 조회
    const participation = await ChallengeParticipation.findOne({
      where: {
        challenge_id: challenge_id,
        user_id: userId,
      },
      attributes: [
        "challenge_participation_id",
        "challenge_participation_count",
      ],
    });

    if (!participation) {
      return res
        .status(403)
        .json({ message: "Unauthorized to create post for this challenge" });
    }

    const challengeParticipationId = participation.challenge_participation_id;

    // 트랜잭션 시작
    const transaction = await sequelize.transaction();

    try {
      // ChallengePost 생성
      const challengePost = await ChallengePost.create(
        {
          challenge_post_text,
          challenge_participation_id: challengeParticipationId,
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

      // challenge_participation_count 증가
      participation.challenge_participation_count += 1;
      await participation.save({ transaction });

      // 트랜잭션 커밋
      await transaction.commit();

      res.status(201).json({
        message: "Challenge post created successfully",
        post: challengePost,
      });
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
    const { postId, email } = req.params; // email 추가
    console.log("Post ID:", postId);
    console.log("User Email:", email);

    // email을 통해 userId 가져오기
    const userId = await getUserIdByEmail(email);
    if (!userId) {
      return res.status(404).json({ message: "User not found" });
    }

    // postId를 통해 해당 post의 challengeParticipation id를 가져오기
    const post = await ChallengePost.findByPk(postId);
    if (!post) {
      return res.status(404).json({ message: "Challenge post not found" });
    }

    const challengeParticipationId = post.challenge_participation_id;

    // challengeParticipation id를 통해 userId 가져오기
    const participation = await ChallengeParticipation.findByPk(
      challengeParticipationId
    );
    if (!participation) {
      return res
        .status(404)
        .json({ message: "Challenge participation not found" });
    }

    // 1번과 3번에서의 UserID가 일치하는지 확인
    if (participation.user_id !== userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this post" });
    }

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

      if (deleteResult === 0) {
        await transaction.rollback(); // 삭제 실패 시 트랜잭션 롤백
        return res.status(404).json({ message: "Challenge post not found" });
      }

      // challenge_participation_count 감소
      participation.challenge_participation_count -= 1;
      await participation.save({ transaction });

      // 트랜잭션 커밋
      await transaction.commit();

      res.status(200).json({
        message: "Challenge post deleted successfully",
        deletedPostId: postId,
      });
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

// 개인이 작성한 포스트 조회 API 엔드포인트
export async function getPostIdsByEmailAndChallenge(
  req: Request,
  res: Response
) {
  try {
    const { email, challenge_id } = req.params; // email과 challenge_id를 body에서 가져옴
    console.log("User Email:", email);
    console.log("Challenge ID:", challenge_id);

    // email을 통해 userId 가져오기
    const userId = await getUserIdByEmail(email);
    if (!userId) {
      return res.status(404).json({ message: "User not found" });
    }

    // challengeId와 userId를 통해 challenge participation id 조회
    const participation = await ChallengeParticipation.findOne({
      where: {
        challenge_id: challenge_id,
        user_id: userId,
      },
      attributes: ["challenge_participation_id"],
    });

    if (!participation) {
      return res
        .status(404)
        .json({ message: "Challenge participation not found" });
    }

    const challengeParticipationId = participation.challenge_participation_id;

    // CHALLENGE_POST 테이블에서 challenge participation id 값이 일치하는 모든 행 조회 (createdAt 순으로 내림차순 정렬)
    const posts = await ChallengePost.findAll({
      where: {
        challenge_participation_id: challengeParticipationId,
      },
      attributes: [
        "challenge_post_id",
        "challenge_post_text",
        "challenge_post_date",
      ],
      order: [["createdAt", "DESC"]],
    });

    const postIds = posts.map((post) => post.challenge_post_id);

    // 각 포스트의 challenge_post_id 값에 해당하는 모든 포스트 이미지 URL을 가져옴
    const photos = await PostPhoto.findAll({
      where: {
        challenge_post_id: {
          [Op.in]: postIds, // Op.in을 사용하여 배열 형태로 전달
        },
      },
      attributes: ["challenge_post_id", "post_photo_url"],
    });

    const postsWithUserInfo = await Promise.all(
      posts.map(async (post) => {
        const userName = await getUsernameById(userId);
        const imageURL = photos
          .filter((photo) => photo.challenge_post_id === post.challenge_post_id)
          .map((photo) => photo.post_photo_url);

        return {
          challenge_post_id: post.challenge_post_id,
          challenge_post_text: post.challenge_post_text,
          challenge_post_date: post.challenge_post_date,
          userName,
          imageURL,
        };
      })
    );

    res.status(200).json({
      message: "Post IDs retrieved successfully",
      posts: postsWithUserInfo,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error:", error.message);
      res.status(500).json({
        error: "Failed to retrieve post IDs",
        details: error.message,
      });
    } else {
      console.log("Error:", error);
      res.status(500).json({
        error: "Failed to retrieve post IDs",
        details: String(error),
      });
    }
  }
}

// 챌린지에 있는 전체 포스트 조회하는 API 엔드포인트
export async function getPostIdsByChallengeId(req: Request, res: Response) {
  try {
    const { challenge_id } = req.params;
    console.log("Challenge ID:", challenge_id);

    // challengeId를 통해 모든 challengeParticipationId 조회
    const challengeParticipationIds = await getParticipationIdByChallengeId(
      Number(challenge_id)
    );

    if (challengeParticipationIds.length === 0) {
      return res.status(404).json({
        message: "No challenge participation found for this challenge ID",
      });
    }

    // ChallengePost 테이블에서 challengeParticipationId 배열에 해당하는 모든 행 조회 (createdAt 순으로 내림차순 정렬)
    const posts = await ChallengePost.findAll({
      where: {
        challenge_participation_id: challengeParticipationIds,
      },
      attributes: [
        "challenge_post_id",
        "challenge_post_text",
        "challenge_post_date",
        "challenge_participation_id",
      ],
      order: [["createdAt", "DESC"]],
    });

    const postIds = posts.map((post) => post.challenge_post_id);

    const participations = await ChallengeParticipation.findAll({
      where: {
        challenge_participation_id: {
          [Op.in]: challengeParticipationIds, // Op.in을 사용하여 배열 형태로 전달
        },
      },
      attributes: ["challenge_participation_id", "user_id"],
    });

    // challengeParticipationIds 배열에 해당하는 모든 포스트 이미지 URL을 가져옴
    const photos = await PostPhoto.findAll({
      where: {
        challenge_post_id: {
          [Op.in]: postIds, // Op.in을 사용하여 배열 형태로 전달
        },
      },
      attributes: ["challenge_post_id", "post_photo_url"],
    });

    const postsWithUserInfo = await Promise.all(
      posts.map(async (post) => {
        const userId = participations.find(
          (p) =>
            p.challenge_participation_id === post.challenge_participation_id
        )?.user_id;

        if (!userId) {
          throw new Error(
            `User ID not found for participation ID ${post.challenge_post_id}`
          );
        }

        const userName = await getUsernameById(userId);
        const imageURL = photos
          .filter((photo) => photo.challenge_post_id === post.challenge_post_id)
          .map((photo) => photo.post_photo_url);

        return {
          challenge_post_id: post.challenge_post_id,
          challenge_post_text: post.challenge_post_text,
          challenge_post_date: post.challenge_post_date,
          userName,
          imageURL,
        };
      })
    );

    res.status(200).json({
      message: "Post IDs retrieved successfully",
      posts: postsWithUserInfo,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error:", error.message);
      res.status(500).json({
        error: "Failed to retrieve post IDs",
        details: error.message,
      });
    } else {
      console.log("Error:", error);
      res.status(500).json({
        error: "Failed to retrieve post IDs",
        details: String(error),
      });
    }
  }
}
