import mongoose from "mongoose";

const InventorySchema = new mongoose.Schema({
  player_id: { type: int, required: true },
  item_id: { type: int, required: true },
  amount: { type: int, required: true },
}, {
  collection: "inventory", // Explicitly set the collection name
});

const Inventory = mongoose.model("Inventory", InventorySchema);

export default Inventory;
