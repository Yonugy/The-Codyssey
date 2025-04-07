import express from "express";
import { getPlayerProgresses } from "../controllers/playerProgressController.js";

const playerProgressRouter = express.Router();

playerProgressRouter.get("/", getPlayerProgresses); // Add route to fetch player progress data

export default playerProgressRouter;
