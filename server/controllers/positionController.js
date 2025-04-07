import Position from "../models/position.js";

export const getPositions = async (req, res) => {
  try {
    const positions = await Position.find(); // Fetch all positions
    res.json(positions);
  } catch (error) {
    res.json({ message: error.message });
  }
};
