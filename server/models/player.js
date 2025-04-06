import mongoose from "mongoose";

const PlayerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  level: { type: Number, required: true },
  experience: { type: Number, required: true },
}, {
  collection: "player", // Explicitly set the collection name
});

const Player = mongoose.model("Player", PlayerSchema);

export default Player;
