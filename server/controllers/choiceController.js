import Choice from "../models/choice.js";

export const getChoices = async (req, res) => {
  try {
    const choices = await Choice.find(); // Fetch all choices
    res.json(choices);
  } catch (error) {
    res.json({ message: error.message });
  }
};
