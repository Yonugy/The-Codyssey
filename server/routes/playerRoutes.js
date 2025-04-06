import express from "express";
import { getPlayers } from "../controllers/playerController.js";

const playerRouter = express.Router();

playerRouter.get("/", getPlayers); // Add route to fetch player data

export default playerRouter;
