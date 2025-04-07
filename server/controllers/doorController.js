import Door from "../models/door.js";

export const getDoors = async (req, res) => {
  try {
    const doors = await Door.find(); // Fetch all doors
    res.json(doors);
  } catch (error) {
    res.json({ message: error.message });
  }
};
