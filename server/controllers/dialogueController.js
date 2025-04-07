import Dialogue from "../models/dialogue.js";

export const getDialogues = async (req, res) => {
  try {
    const dialogues = await Dialogue.find(); // Fetch all dialogues
    res.json(dialogues);
  } catch (error) {
    res.json({ message: error.message });
  }
};
