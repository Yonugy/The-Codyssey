import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, {
  collection: "admin" // Explicitly set the collection name
});

const Admin = mongoose.model("Admin", AdminSchema);

export default Admin;
