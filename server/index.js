import "dotenv/config"; // Ensure dotenv is loaded first
import express from "express";
import cors from "cors"; // Import cors

import connectDB from "./config/mongodb.js";
import npcRouter from "./routes/npcRoutes.js";
import inventoryRouter from "./routes/inventoryRoutes.js"; // Import inventory routes
import playerRouter from "./routes/playerRoutes.js"; // Import player routes
import locationRouter from "./routes/locationRoutes.js"; // Import location routes
import doorRouter from "./routes/doorRoutes.js"; // Import door routes
import itemRouter from "./routes/itemRoutes.js"; // Import item routes
import actionRouter from "./routes/actionRoutes.js"; // Import action routes
import packageDetailRouter from "./routes/packageDetailRoutes.js"; // Import package_detail routes
import dialogueRouter from "./routes/dialogueRoutes.js"; // Import dialogue routes
import positionRouter from "./routes/positionRoutes.js"; // Import position routes
import subquestRouter from "./routes/subquestRoutes.js"; // Import subquest routes
import packageRouter from "./routes/packageRoutes.js"; // Import package routes
import choiceRouter from "./routes/choiceRoutes.js"; // Import choice routes
import questRouter from "./routes/questRoutes.js"; // Import quest routes
import playerProgressRouter from "./routes/playerProgressRoutes.js"; // Import playerProgress routes

const app = express();
app.use(cors()); // Enable CORS
const corsOptions = {
  origin: ["http://127.0.0.1:5500", "https://the-codyssey.vercel.app"], // Replace with your frontend URL
  methods: 'GET,POST', // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
app.use(express.json());

const PORT = process.env.PORT || 4000;
console.log(PORT);

connectDB();

app.get("/", (req, res) => res.send("API Working"));
app.use("/npc", npcRouter); // Register the NPC routes
app.use("/inventory", inventoryRouter); // Register inventory routes
app.use("/player", playerRouter); // Register player routes
app.use("/location", locationRouter); // Register location routes
app.use("/door", doorRouter); // Register door routes
app.use("/item", itemRouter); // Register item routes
app.use("/action", actionRouter); // Register action routes
app.use("/package_detail", packageDetailRouter); // Register package_detail routes
app.use("/dialogue", dialogueRouter); // Register dialogue routes
app.use("/position", positionRouter); // Register position routes
app.use("/subquest", subquestRouter); // Register subquest routes
app.use("/package", packageRouter); // Register package routes
app.use("/choice", choiceRouter); // Register choice routes
app.use("/quest", questRouter); // Register quest routes
app.use("/player_progress", playerProgressRouter); // Register playerProgress routes

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});