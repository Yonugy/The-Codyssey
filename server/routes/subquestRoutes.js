import express from "express";
import { getSubquests } from "../controllers/subquestController.js";

const subquestRouter = express.Router();

subquestRouter.get("/", getSubquests); // Add route to fetch subquest data

export default subquestRouter;
