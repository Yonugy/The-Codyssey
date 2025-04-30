import express from "express";
import { getInventories, updateOrAddInventory } from "../controllers/inventoryController.js";

const inventoryRouter = express.Router();

// Route to fetch all inventories
inventoryRouter.get("/", getInventories);

// Route to add a new inventory
inventoryRouter.post("/", updateOrAddInventory);

export default inventoryRouter;
