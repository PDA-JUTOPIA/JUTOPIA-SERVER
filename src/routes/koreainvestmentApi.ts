import { Router } from "express";
import { getDomesticStock } from "../controllers/koreainvestmentApiController";

const router = Router();

router.get("/domestic-stock", getDomesticStock);

export default router;
