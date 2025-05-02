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

export const updatePlayerProgressStatus = async (req, res) => {
  try {
    const { player_id, subquest_id, status } = req.body;

    // Find the record by player_id and subquest_id and update the status
    const updatedProgress = await PlayerProgress.findOneAndUpdate(
      { player_id, subquest_id }, // Find the record by player_id and subquest_id
      { status }, // Update the status field
      { new: true } // Return the updated document
    );

    if (!updatedProgress) {
      return res.status(404).json({ message: "Player progress not found" }); // Handle record not found
    }

    res.status(200).json(updatedProgress); // Respond with the updated record
  } catch (error) {
    res.status(400).json({ message: error.message }); // Handle errors
  }
};

export const deleteAllPlayerProgresses = async (req, res) => {
  try {
    const result = await PlayerProgress.deleteMany(); // Delete all records
    res.status(200).json({ message: "All player progress records deleted successfully", result });
  } catch (error) {
    res.status(500).json({ message: error.message }); // Handle errors
  }
};