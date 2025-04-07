import express from "express";
import { getPositions } from "../controllers/positionController.js";

const positionRouter = express.Router();

positionRouter.get("/", getPositions); // Add route to fetch position data

export default positionRouter;
