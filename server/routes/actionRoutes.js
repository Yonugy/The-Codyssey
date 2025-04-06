import express from "express";
import { getActions } from "../controllers/actionController.js";

const actionRouter = express.Router();

actionRouter.get("/", getActions); // Add route to fetch action data

export default actionRouter;
