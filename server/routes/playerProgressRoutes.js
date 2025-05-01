import express from "express";
import { getPlayerProgresses,addPlayerProgress } from "../controllers/playerProgressController.js";

const playerProgressRouter = express.Router();

playerProgressRouter.get("/", getPlayerProgresses); // Add route to fetch player progress data

playerProgressRouter.post("/", addPlayerProgress);

export default playerProgressRouter;
