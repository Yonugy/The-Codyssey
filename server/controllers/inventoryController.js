import Inventory from "../models/inventory.js";

export const getInventories = async (req, res) => {
  try {
    const inventories = await Inventory.find(); // Fetch all inventories
    res.json(inventories);
  } catch (error) {
    res.json({ message: error.message });
  }
};

export const updateOrAddInventory = async (req, res) => {
  try {
    const { player_id, item_id, amount } = req.body;

    // Convert inputs to numbers to avoid CastError
    const playerId = Number(player_id);
    const itemId = Number(item_id);
    const incrementValue = Number(amount);

    // Perform the update or add operation
    await Inventory.updateOne(
      { player_id: playerId, item_id: itemId }, // Filter criteria
      { $inc: { amount: incrementValue } }, // Increment operation
      { upsert: true } // Insert a new record if no match is found
    );

    res.status(200).json({ message: "Inventory updated or added successfully" });

  } catch (error) {
    console.error("Error updating or adding inventory:", error);
  }
};

export const getAmount = async (req, res) => {
  try {
    const { player_id, item_id } = req.query;

    // Convert inputs to numbers to avoid CastError
    const playerId = Number(player_id);
    const itemId = Number(item_id);

    if (isNaN(playerId) || isNaN(itemId)) {
      return res.status(400).json({ message: "Invalid player_id or item_id" });
    }

    // Find the inventory record
    const inventory = await Inventory.findOne({ player_id: playerId, item_id: itemId });

    // Return 0 if the item is not found
    const amount = inventory ? inventory.amount : 0;

    res.status(200).json({ amount });
  } catch (error) {
    console.error("Error fetching amount:", error);
    res.status(500).json({ message: "Error fetching amount", error: error.message });
  }
};