import { Router } from "express";
import { readRewardOne, readRewards } from "../controllers/RewardController";
const router = Router();

router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.get("/read", readRewards);
router.get("/:rewardId", readRewardOne);

export default router;
