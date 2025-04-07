import express from "express";
import { getChoices } from "../controllers/choiceController.js";

const choiceRouter = express.Router();

choiceRouter.get("/", getChoices); // Add route to fetch choice data

export default choiceRouter;
