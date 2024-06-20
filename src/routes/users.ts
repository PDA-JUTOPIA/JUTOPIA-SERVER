import { Router } from "express";
import {
  createUser,
  loginUser,
  readSinceJoinDate,
} from "../controllers/UserController";
const router = Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/signup", createUser);
router.post("/login", loginUser);
router.get("/days/email/:email", readSinceJoinDate);

export default router;
