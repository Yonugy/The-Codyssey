import Choice from "../models/choice.js";

export const getChoices = async (req, res) => {
  try {
    const choices = await Choice.find(); // Fetch all choices
    res.json({ success: true, choices });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
