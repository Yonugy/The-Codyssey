import express from "express";
import { getNPCs } from "../controllers/npcController.js"; // Import getNPCs

const npcRouter = express.Router(); // Corrected router name

// Define NPC routes
// npcRouter.post("/npc", addNPC); // Add route to create NPC
npcRouter.get("/", getNPCs); // Corrected route to match "/npc"

export default npcRouter; // Corrected export
