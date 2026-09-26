const authMiddleware = require("../middleware/authMiddleware");
const express = require("express");
const multer = require("multer");
const cloudinary = require("../cloudinary");

const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage()
});

router.post("/", authMiddleware, upload.single("file"), async (req, res) => {
    console.log("UPLOAD REQUEST RECEIVED");
    console.log("FILE:", req.file?.originalname, req.file?.size);

    try {
        const isVideo = req.file.mimetype.startsWith("video/");

        console.log("STARTING CLOUDINARY UPLOAD");

        const result = await new Promise((resolve, reject) => {

            const stream = cloudinary.uploader.upload_stream(
                {
                    resource_type: isVideo ? "video" : "image",
                    type: "upload",
                    timeout: 300000
                },
                (error, result) => {

                    if (error) {
                        console.log("CLOUDINARY ERROR:", error);
                        reject(error);
                        return;
                    }

                    console.log("CLOUDINARY UPLOAD COMPLETE");
                    resolve(result);
                }
            );

            stream.on("error", (error) => {
                console.log("STREAM ERROR:", error);
                reject(error);
            });

            stream.end(req.file.buffer);

            console.log("FILE SENT TO CLOUDINARY");
        });

        res.json({
            message: "File uploaded successfully",
            url: result.secure_url
        });

    } catch (error) {

        console.error("UPLOAD ERROR:", error);

        res.status(500).json({
            message: error.message
        });
    }
});

module.exports = router;
