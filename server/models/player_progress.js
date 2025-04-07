import mongoose from "mongoose";

const PlayerProgressSchema = new mongoose.Schema({
  questId: { type: mongoose.Schema.Types.ObjectId, ref: "Quest", required: true },
  progress: { type: String, required: true },
}, {
  collection: "player_progress", // Explicitly set the collection name
});

const PlayerProgress = mongoose.model("PlayerProgress", PlayerProgressSchema);

export default PlayerProgress;
