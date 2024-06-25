import { Router } from "express";
import {
  readAllRecurit,
  createRecurit,
  setChallengeDirectory,
} from "../controllers/ChallengeController";
import { imageUploader } from "../middleware/image.uploader";
import { Request, Response, NextFunction } from "express";

const router = Router();

router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});
router.get("/readAllRecurit", readAllRecurit);

router.post(
  "/createRecurit",
  setChallengeDirectory,
  (req: Request, res: Response, next: NextFunction) => {
    console.log("Uploading image");
    imageUploader.array("image")(req, res, (err: any) => {
      if (err) {
        console.error("Error uploading image:", err);
        return res.status(500).send("Error uploading image");
      }
      next();
    });
  },
  createRecurit
);

export default router;
