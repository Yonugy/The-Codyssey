import express from "express";
import { getItems } from "../controllers/itemController.js";

const itemRouter = express.Router();

itemRouter.get("/", getItems); // Add route to fetch item data

export default itemRouter;
