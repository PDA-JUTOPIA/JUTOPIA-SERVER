import { Router } from "express";
import { readAllRecurit } from "../controllers/ChallengeController";

const router = Router();

router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});
router.get("/readAllRecurit", readAllRecurit);

export default router;
