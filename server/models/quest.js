import mongoose from "mongoose";

const QuestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  reward: { type: String },
}, {
  collection: "quest", // Explicitly set the collection name
});

const Quest = mongoose.model("Quest", QuestSchema);

export default Quest;
