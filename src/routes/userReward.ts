import { Router } from "express";
import {
  createUserReward,
  readUserReward,
} from "../controllers/UserRewardController";
const router = Router();

router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/create", createUserReward);
router.get("/:email", readUserReward);

export default router;
