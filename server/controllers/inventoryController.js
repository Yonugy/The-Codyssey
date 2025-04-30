import Inventory from "../models/inventory.js";

export const getInventories = async (req, res) => {
  try {
    const inventories = await Inventory.find(); // Fetch all inventories
    res.json(inventories);
  } catch (error) {
    res.json({ message: error.message });
  }
};

// export const addInventory = async (req, res) => {
//   try {
//     const newInventory = new Inventory(req.body); // Create a new inventory record
//     const savedInventory = await newInventory.save(); // Save to database
//     res.status(201).json(savedInventory); // Respond with the saved record
//   } catch (error) {
//     res.status(400).json({ message: error.message }); // Handle errors
//   }
// };

// export const updateOrAddInventory = async (player_id, item_id, incrementValue) => {
//   try {
//     await Inventory.updateOne(
//       { player_id, item_id }, // Filter criteria
//       { $inc: { amount: incrementValue } }, // Increment operation
//       { upsert: true } // Insert a new record if no match is found
//     );
//   } catch (error) {
//     console.error("Error updating or adding inventory:", error);
//   }
// };

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
    console.log(player_id, item_id, amount);

  } catch (error) {
    console.error("Error updating or adding inventory:", error);
  }
};