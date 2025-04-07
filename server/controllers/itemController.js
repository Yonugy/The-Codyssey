import Item from "../models/item.js";

export const getItems = async (req, res) => {
  try {
    const items = await Item.find(); // Fetch all items
    res.json(items);
  } catch (error) {
    res.json({ message: error.message });
  }
};
