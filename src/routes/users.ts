import { Router } from "express";
import {
  createUser,
  loginUser,
  readSinceJoinDate,
  updateUsername,
  getUserId,
  getUserLearningStatus,
  getPostIdsByEmailAndChallenge,
} from "../controllers/UserController";
const router = Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/signup", createUser);
router.post("/login", loginUser);
router.get("/days/email/:email", readSinceJoinDate);
router.put("/updateName", updateUsername);
router.post("/user-id", getUserId);
router.post("/get-user-learning-status", getUserLearningStatus);
router.post("/get-post-check/", getPostIdsByEmailAndChallenge);

export default router;
