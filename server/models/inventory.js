import mongoose from "mongoose";

const InventorySchema = new mongoose.Schema({
  player_id: { type: Number, required: true },
  item_id: { type: Number, required: true },
  amount: { type: Number },
}, {
  collection: "inventory", // Explicitly set the collection name
});

const Inventory = mongoose.model("Inventory", InventorySchema);

export default Inventory;
