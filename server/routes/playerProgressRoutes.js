import express from "express";
import { getPlayerProgresses,addPlayerProgress,updatePlayerProgressStatus } from "../controllers/playerProgressController.js";

const playerProgressRouter = express.Router();

playerProgressRouter.get("/", getPlayerProgresses); // Add route to fetch player progress data

playerProgressRouter.post("/", addPlayerProgress);

playerProgressRouter.post("/update", updatePlayerProgressStatus);

export default playerProgressRouter;
