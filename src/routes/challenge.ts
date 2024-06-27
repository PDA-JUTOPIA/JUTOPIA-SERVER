import { Router } from "express";
import {
  readAllRecurit,
  createRecurit,
  setChallengeDirectory,
  readChallengeByChallengeIds,
  readChallenge,
} from "../controllers/ChallengeController";
import { imageUploader } from "../middleware/image.uploader";
import { Request, Response, NextFunction } from "express";

const router = Router();

router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});
router.get("/readChallenge/challengeId/:challengeId", readChallenge);
router.get("/readAllRecurit", readAllRecurit);
router.post("/joinChallengeList", readChallengeByChallengeIds);

router.post(
  "/createRecurit",
  setChallengeDirectory,
  (req: Request, res: Response, next: NextFunction) => {
    console.log("Uploading image");
    imageUploader.array("challenge_thumbnail")(req, res, (err: any) => {
      if (err) {
        return res.status(500).send("Error uploading image: " + err);
      }
      next();
    });
  },
  createRecurit
);

export default router;
