import mongoose from "mongoose";

const PositionSchema = new mongoose.Schema(
  {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    z: { type: Number, required: true },
  },
  {
    collection: "position", // Explicitly set the collection name
  }
);

const Position = mongoose.model("Position", PositionSchema);

export default Position;
