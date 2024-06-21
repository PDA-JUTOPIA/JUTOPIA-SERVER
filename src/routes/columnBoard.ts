import { Router } from "express";
import { getColumnBoardData } from "../controllers/ColumnBoardController";

const router = Router();

router.get("/list", getColumnBoardData);

export default router;
