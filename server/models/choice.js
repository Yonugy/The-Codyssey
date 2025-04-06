import mongoose from "mongoose";

const ChoiceSchema = new mongoose.Schema({
  text: { type: String, required: true },
  outcome: { type: String },
}, {
  collection: "choice", // Explicitly set the collection name
});

const Choice = mongoose.model("Choice", ChoiceSchema);

export default Choice;
