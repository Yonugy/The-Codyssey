import Action from "../models/action.js";

export const getActions = async (req, res) => {
  try {
    const actions = await Action.find(); // Fetch all actions
    res.json({ success: true, actions });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
