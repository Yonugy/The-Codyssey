import express from "express";
// import {
//   createStaff,
//   deleteStaff,
//   searchStaff,
//   getStaffProfile,
//   updateStaffRecords,
//   assignPrivileges,
//   getPrivilegedStaff,
//   assignPrivilegesToMultipleStaff,
//   saveViewableStaff,
// } from "../controllers/staffController.js"; // Commented out as it's not used
import { addNPC } from "../controllers/npcController.js";
// import userAuth from "../middleware/userAuth.js";

const staffRouter = express.Router();

// Commented out unused routes
// staffRouter.post("/create", createStaff);
// staffRouter.delete("/delete/:id", deleteStaff);
// staffRouter.get("/search", searchStaff);
// staffRouter.get("/profile/:id", getStaffProfile);
// staffRouter.put("/update/:id", updateStaffRecords);
// staffRouter.put("/privileges/:id", assignPrivileges);
// staffRouter.get("/privileged", getPrivilegedStaff);
// staffRouter.put("/assign-privileges", assignPrivilegesToMultipleStaff);
// staffRouter.put("/save-viewable-staff", saveViewableStaff);

staffRouter.post("/npc", addNPC);

export default staffRouter;
