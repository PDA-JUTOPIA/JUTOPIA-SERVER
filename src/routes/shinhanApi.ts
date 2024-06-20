import { Router } from "express";
import { getMarketIssues } from "../controllers/shinhanApiController";

const router = Router();

router.get("/market-issue", getMarketIssues);

export default router;
