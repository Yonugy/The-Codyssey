import mongoose from "mongoose";

const PlayerProgressSchema = new mongoose.Schema({
  player_id: { type: Number, required: true },
  subquest_id: { type: Number, required: true },
  status: { type: String },
}, {
  collection: "player_progress", // Explicitly set the collection name
});

const PlayerProgress = mongoose.model("PlayerProgress", PlayerProgressSchema);

export default PlayerProgress;
