import { Router } from "express";
import { createUser } from "../controllers/UserController";
const router = Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/signup", createUser);

export default router;
