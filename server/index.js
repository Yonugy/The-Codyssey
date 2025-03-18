const express = require("express");
const path = require("path");

const app = express();
const port = process.env.PORT || 5500;

// Serve frontend (static files from root)
app.use(express.static(path.join(__dirname, "..")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "main.html"));
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
