import express from "express";
import { getPackages } from "../controllers/packageController.js";

const packageRouter = express.Router();

packageRouter.get("/", getPackages); // Add route to fetch package data

export default packageRouter;
