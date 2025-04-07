import mongoose from "mongoose";

const ActionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  effect: { type: String },
}, {
  collection: "action", // Explicitly set the collection name
});

const Action = mongoose.model("Action", ActionSchema);

export default Action;
