import PlayerProgress from "../models/player_progress.js";

export const getPlayerProgresses = async (req, res) => {
  try {
    const playerProgress = await PlayerProgress.find(); // Fetch all player progress
    res.json(playerProgress);
  } catch (error) {
    res.json({ message: error.message });
  }
};

export const addPlayerProgress = async (req, res) => {
  try {
    const newPlayerProgress = new PlayerProgress(req.body); // Create a new record from the request body
    const savedPlayerProgress = await newPlayerProgress.save(); // Save the record to the database
    res.status(201).json(savedPlayerProgress); // Respond with the saved record
  } catch (error) {
    res.status(400).json({ message: error.message }); // Handle errors
  }
};