import Item from "../models/item.js";

export const getItems = async (req, res) => {
  try {
    const items = await Item.find(); // Fetch all items
    res.json({ success: true, items });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
