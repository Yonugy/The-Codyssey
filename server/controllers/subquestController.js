import Subquest from "../models/subquest.js";

export const getSubquests = async (req, res) => {
  try {
    const subquests = await Subquest.find(); // Fetch all subquests
    res.json(subquests);
  } catch (error) {
    res.json({ message: error.message });
  }
};
