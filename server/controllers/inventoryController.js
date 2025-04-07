import Inventory from "../models/inventory.js";

export const getInventories = async (req, res) => {
  try {
    const inventories = await Inventory.find(); // Fetch all inventories
    res.json(inventories);
  } catch (error) {
    res.json({ message: error.message });
  }
};
