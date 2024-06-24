import { Router } from "express";
import {
  createUserCurrentLearning,
  updateUserCurrentLearning,
  readUserCurrentLearning,
} from "../controllers/UserCurrentLearningController";
const router = Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/create", createUserCurrentLearning);
router.get("/:email", readUserCurrentLearning);
router.put("/update", updateUserCurrentLearning);

export default router;
