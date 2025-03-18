const express = require('express');
const app = express();

const allowedOrigins = [
    "http://127.0.0.1:5500"
]

const cors = require('cors');

const corsOptions = {
    origin: 'http://127.0.0.1:5500', // Replace with your frontend URL
    methods: 'GET,POST', // Allowed HTTP methods
};

app.use(cors(corsOptions));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "..", "main.html"));
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});