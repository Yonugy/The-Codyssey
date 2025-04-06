import NPC from "../models/npc.js"; // Import the NPC model

export const getNPCs = async (req, res) => {
  try {
    const npcs = await NPC.find(); // Fetch all NPCs from the collection
    res.json({ success: true, npcs });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
