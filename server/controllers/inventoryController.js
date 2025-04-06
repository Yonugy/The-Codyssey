import Inventory from "../models/inventory.js";

export const getInventories = async (req, res) => {
  try {
    const inventories = await Inventory.find(); // Fetch all inventories
    res.json({ success: true, inventories });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
