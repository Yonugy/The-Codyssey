import PlayerProgress from "../models/player_progress.js";

export const getPlayerProgresses = async (req, res) => {
  try {
    const playerProgresses = await PlayerProgress.find(); // Fetch all player progresses
    res.json({ success: true, playerProgresses });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
