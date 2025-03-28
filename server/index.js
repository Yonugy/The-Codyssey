import "dotenv/config"; // Ensure dotenv is loaded first
import express from "express";
import cors from "cors"; // Import cors

import connectDB from "./config/mongodb.js";
import npcRouter from "./routes/npcRoutes.js";

const app = express();
app.use(cors()); // Enable CORS
app.use(express.json());

const PORT = process.env.PORT || 4000;
console.log(PORT);

connectDB();

app.get("/", (req, res) => res.send("API Working"));
// app.use("/auth", authRouter);
// app.use("/user", userRouter);
// app.use("/departments", departmentRouter); // Use department routes
// app.use("/staff", staffRouter); // Use staff routes
// app.use("/category", performanceCategoryRoutes);
// app.use("/entry", performanceEntryRoutes); // Use performance entry routes
// app.use("/performance-report", performanceReportRoutes); // Use performance report routes
app.use("/npc", npcRouter); // Register the NPC routes

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});