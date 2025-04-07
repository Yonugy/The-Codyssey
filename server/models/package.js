import mongoose from "mongoose";

const PackageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  weight: { type: Number },
}, {
  collection: "package", // Explicitly set the collection name
});

const Package = mongoose.model("Package", PackageSchema);

export default Package;
