const authMiddleware = require("../middleware/authMiddleware");
const express = require("express");
const Video = require("../models/video");

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
    try {
        const video = await Video.create(req.body);
        res.status(201).json(video);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/", async (req, res) => {
    try {
        const videos = await Video.find();
        res.json(videos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        await Video.findByIdAndDelete(req.params.id);
        res.json({ message: "Video deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
