import mongoose from "mongoose";

const InventorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
}, {
  collection: "inventory", // Explicitly set the collection name
});

const Inventory = mongoose.model("Inventory", InventorySchema);

export default Inventory;
