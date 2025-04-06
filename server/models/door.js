import mongoose from "mongoose";

const DoorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  isLocked: { type: Boolean, required: true },
}, {
  collection: "door", // Explicitly set the collection name
});

const Door = mongoose.model("Door", DoorSchema);

export default Door;
