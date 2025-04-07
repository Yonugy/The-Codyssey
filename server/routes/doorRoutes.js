import express from "express";
import { getDoors } from "../controllers/doorController.js";

const doorRouter = express.Router();

doorRouter.get("/", getDoors); // Add route to fetch door data

export default doorRouter;
