import Player from "../models/player.js";

export const getPlayers = async (req, res) => {
  try {
    const players = await Player.find(); // Fetch all players
    res.json(players);
  } catch (error) {
    res.json({ message: error.message });
  }
};
