import express from "express";
import { getQuests } from "../controllers/questController.js";

const questRouter = express.Router();

questRouter.get("/", getQuests); // Add route to fetch quest data

export default questRouter;
