import Door from "../models/door.js";

export const getDoors = async (req, res) => {
  try {
    const doors = await Door.find(); // Fetch all doors
    res.json({ success: true, doors });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
