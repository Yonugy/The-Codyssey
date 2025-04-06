import Position from "../models/position.js";

export const getPositions = async (req, res) => {
  try {
    const positions = await Position.find(); // Fetch all positions
    res.json({ success: true, positions });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
