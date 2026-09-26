require("dotenv").config();

const uploadRoutes = require("./Routes/uploadRoutes");
const cloudinary = require("./cloudinary");

const cors = require("cors");

require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);


const express = require("express");
const noteRoutes = require("./Routes/noteRoutes.js");
const videoRoutes = require("./Routes/videoRoutes.js");
const authRoutes = require("./Routes/authRoutes.js");



const app = express();
app.use(cors());
app.use("/api/upload", uploadRoutes);
app.use(express.json());

app.use("/api/notes", noteRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/auth", authRoutes);
console.log("NOTE ROUTES LOADED");

const PORT = 5000;

app.get("/", (req, res) => {
    res.send("Tuition backend is running!");
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB connected successfully!");
    })
    .catch((error) => {
        console.log("MongoDB connection failed:", error);
    });