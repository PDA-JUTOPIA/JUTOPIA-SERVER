import { Router } from "express";
import {
  createUserCurrentLearning,
  updateUserCurrentLearning,
  readUserCurrentLearning,
  updateUserCurrentReward,
} from "../controllers/UserCurrentLearningController";
const router = Router();

router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/create", createUserCurrentLearning);
router.get("/:email", readUserCurrentLearning);
router.put("/update", updateUserCurrentLearning);
router.put("/update/reward", updateUserCurrentReward);

export default router;
