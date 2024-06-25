import { Router } from "express";
import {
  createUser,
  loginUser,
  readSinceJoinDate,
  updateUsername,
  getUserId,
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

export default router;
