import express from "express";
import { getDialogues } from "../controllers/dialogueController.js";

const dialogueRouter = express.Router();

dialogueRouter.get("/", getDialogues); // Add route to fetch dialogue data

export default dialogueRouter;
