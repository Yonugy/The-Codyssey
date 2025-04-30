import express from "express";
import { getInventories, addInventory } from "../controllers/inventoryController.js";

const inventoryRouter = express.Router();

// Route to fetch all inventories
inventoryRouter.get("/", getInventories);

// Route to add a new inventory
inventoryRouter.post("/", addInventory);

export default inventoryRouter;
