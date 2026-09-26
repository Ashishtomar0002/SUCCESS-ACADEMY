const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
    subject: {
        type: String,
        required: true
    },
    grade: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    fileUrl: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Note = mongoose.model("Note", noteSchema);

module.exports = Note;


