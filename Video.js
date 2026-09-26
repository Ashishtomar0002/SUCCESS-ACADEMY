const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
    subject: {
        type: String,
        required: true
    },
    grade: {
        type: String,
        required: false
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    videoUrl: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Video = mongoose.model("Video", videoSchema);

module.exports = Video;