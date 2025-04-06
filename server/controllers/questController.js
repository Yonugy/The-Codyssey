import Quest from "../models/quest.js";

export const getQuests = async (req, res) => {
  try {
    const quests = await Quest.find(); // Fetch all quests
    res.json({ success: true, quests });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
