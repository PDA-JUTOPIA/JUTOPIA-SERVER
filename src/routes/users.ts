import { Router } from "express";
import { createUser, loginUser } from "../controllers/UserController";
const router = Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/signup", createUser);
router.post("/login", loginUser);

export default router;
