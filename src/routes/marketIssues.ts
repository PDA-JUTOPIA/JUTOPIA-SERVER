import { Router } from "express";
import { getMarketIssues } from "../controllers/MarketIssueController";

const router = Router();

router.get("/", getMarketIssues);

export default router;
