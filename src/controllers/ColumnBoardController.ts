import { Request, Response } from "express";
import { ColumnBoard } from "../models/columnBoard";

export const getColumnBoardData = async (req: Request, res: Response) => {
  try {
    const columnBoardData = await ColumnBoard.findAll();
    res.json(columnBoardData);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
};
