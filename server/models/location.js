import mongoose from "mongoose";

const LocationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
}, {
  collection: "location", // Explicitly set the collection name
});

const Location = mongoose.model("Location", LocationSchema);

export default Location;
