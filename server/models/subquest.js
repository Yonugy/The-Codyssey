import mongoose from "mongoose";

const SubquestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
  },
  {
    collection: "subquest", // Explicitly set the collection name
  }
);

const Subquest = mongoose.model("Subquest", SubquestSchema);

export default Subquest;
