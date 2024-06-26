import { Request, Response } from "express";
import { ChallengePostComment } from "../models/challengePostComment";
import { User } from "../models/user";

export async function deleteComment(req: Request, res: Response) {
  try {
    const { challengePostCommentId } = req.params;

    const result = await ChallengePostComment.findOne({
      where: {
        challenge_post_comment_id: challengePostCommentId,
      },
    });

    if (!result) {
      return res.status(400).json({ message: "comment Not Found" });
    }

    result.destroy();

    res.status(200).json({ reuslt: "ok" });
  } catch (error) {
    res.status(500).json({ error: "Failed to read challenge" });
  }
}

export async function readCommentList(req: Request, res: Response) {
  try {
    const { challengePostId } = req.params;

    const result = await ChallengePostComment.findAll({
      where: {
        challenge_post_id: challengePostId,
      },
    });

    if (!result) {
      return res.status(400).json({ message: "challenge Not Found" });
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to read challenge" });
  }
}

export async function createComment(req: Request, res: Response) {
  try {
    const { userId, challengePostId, commentText } = req.body;
    const existingUser = await User.findOne({
      where: {
        user_id: userId,
      },
    });

    if (!existingUser) {
      return res.status(400).json({ message: "No user" });
    }

    const comment = await ChallengePostComment.create({
      challenge_post_comment_text: commentText,
      user_id: userId,
      challenge_post_id: challengePostId,
    });

    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ message: "Failed to create comment", error });
  }
}
