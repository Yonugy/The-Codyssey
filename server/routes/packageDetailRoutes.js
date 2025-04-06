import express from "express";
import { getPackageDetails } from "../controllers/packageDetailController.js";

const packageDetailRouter = express.Router();

packageDetailRouter.get("/", getPackageDetails); // Add route to fetch package detail data

export default packageDetailRouter;
