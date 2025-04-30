import express from "express";
import { getInventories, updateOrAddInventory, getAmount } from "../controllers/inventoryController.js";

const inventoryRouter = express.Router();

// Route to fetch all inventories
inventoryRouter.get("/", getInventories);

// Route to add a new inventory
inventoryRouter.post("/", updateOrAddInventory);

inventoryRouter.get("/amount", getAmount);

export default inventoryRouter;
