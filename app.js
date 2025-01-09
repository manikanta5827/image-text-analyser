const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const FoodDataController = require("./Helper/FoodDataController.js");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(morgan('dev'));


// API Route
app.get("/api/food-data", async (req, res) => {
    const { imageUrl } = req.query;

    if (!imageUrl) {
        return res.status(400).json({ error: "Missing 'imageUrl' query parameter." });
    }

    try {
        const structuredData = await FoodDataController.processFoodData(imageUrl);
        res.status(200).json(structuredData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
