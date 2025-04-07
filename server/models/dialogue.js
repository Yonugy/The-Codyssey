import mongoose from "mongoose";

const DialogueSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    character: { type: String },
  },
  {
    collection: "dialogue", // Explicitly set the collection name
  }
);

const Dialogue = mongoose.model("Dialogue", DialogueSchema);

export default Dialogue;
