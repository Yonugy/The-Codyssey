import express from "express";
import { getInventories } from "../controllers/inventoryController.js";

const inventoryRouter = express.Router();

inventoryRouter.get("/", getInventories); // Add route to fetch inventory data

export default inventoryRouter;
