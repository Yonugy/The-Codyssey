import express from "express";
import { getNpcs } from "../controllers/npcController.js"; // Import getNPCs

const npcRouter = express.Router(); // Corrected router name

// Define NPC routes
// npcRouter.post("/npc", addNPC); // Add route to create NPC
npcRouter.get("/", getNpcs); // Corrected route to match "/npc"

export default npcRouter; // Corrected export
