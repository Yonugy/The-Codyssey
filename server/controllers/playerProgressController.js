import PlayerProgress from "../models/player_progress.js";

export const getPlayerProgresses = async (req, res) => {
  try {
    const playerProgress = await PlayerProgress.find(); // Fetch all player progress
    res.json(playerProgress);
  } catch (error) {
    res.json({ message: error.message });
  }
};
