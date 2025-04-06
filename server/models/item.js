import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
}, {
  collection: "item", // Explicitly set the collection name
});

const Item = mongoose.model("Item", ItemSchema);

export default Item;
