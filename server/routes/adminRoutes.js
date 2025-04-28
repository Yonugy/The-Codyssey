import express from "express";
import { createAdmin, getAdmins, deleteAdmin } from "../controllers/adminController.js";

const adminRouter = express.Router();

// Route to create a new admin
adminRouter.post("/", createAdmin);

// Route to get all admins
adminRouter.get("/", getAdmins);

// Route to delete an admin by ID
adminRouter.delete("/:id", deleteAdmin);

export default adminRouter;
