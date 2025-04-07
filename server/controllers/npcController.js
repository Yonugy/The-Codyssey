import Npc from "../models/npc.js";

export const getNpcs = async (req, res) => {
  try {
    const npcs = await Npc.find(); // Fetch all NPCs
    res.json(npcs);
  } catch (error) {
    res.json({ message: error.message });
  }
};
