import express from "express";
import { getLocations } from "../controllers/locationController.js";

const locationRouter = express.Router();

locationRouter.get("/", getLocations); // Add route to fetch location data

export default locationRouter;
