"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVideo = exports.updateVideo = exports.addLike = exports.addVideos = exports.getAllVideos = exports.displayAllVideos = exports.getAllVideosFromAssets = exports.getAllVideoNamesWithLinks = exports.deleteVideos = exports.updateVideos = exports.streamVideo = exports.getMultipleLinks = exports.getAllVideoNames = exports.addVideo = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
const video_1 = __importDefault(require("../models/video"));
const express_validator_1 = require("express-validator");
// videos from ../assets
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "src/assets"); // Store in the assets folder
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Use the original filename
    },
});
const upload = (0, multer_1.default)({ storage: storage }).single("videoFile");
const addVideo = (req, res) => {
    upload(req, res, function (err) {
        return __awaiter(this, void 0, void 0, function* () {
            if (err) {
                console.log("Error uploading file:", err);
                return res.status(500).json({ message: "Error uploading file" });
            }
            const { title, likes } = req.body;
            const file = req.file;
            if (!file) {
                return res.status(400).json({ message: "No file uploaded" });
            }
            const url = `/assets/${file.filename}`;
            try {
                // Check if the video with this title already exists
                const existingVideo = yield video_1.default.findOneByTitle(title);
                if (existingVideo) {
                    return res
                        .status(400)
                        .json({ message: "Video with this title already exists" });
                }
                const video = new video_1.default(title, url, likes);
                yield video.save(); // Save the video details to the database
                return res.status(200).json({ message: "Successfully added", video });
            }
            catch (error) {
                console.error("Failed to add video:", error);
                return res.status(500).json({ message: "Failed to add video" });
            }
        });
    });
};
exports.addVideo = addVideo;
const getAllVideoNames = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const assetFolder = path_1.default.join(__dirname, "..", "assets");
        const videoFiles = fs_1.default
            .readdirSync(assetFolder)
            .filter((file) => file.endsWith(".mp4"));
        if (videoFiles.length === 0) {
            res.status(404).json({ message: "No videos found" });
            return;
        }
        res.status(200).json({ videoFiles });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to load video metadata" });
    }
});
exports.getAllVideoNames = getAllVideoNames;
const getMultipleLinks = (req, res) => {
    const multipleLinks = [
        "https://download.samplelib.com/mp4/sample-5s.mp4",
        "https://download.samplelib.com/mp4/sample-5s.mp4",
        "https://download.samplelib.com/mp4/sample-5s.mp4",
        // Add more links here as needed
    ];
    res.status(200).json({ links: multipleLinks });
};
exports.getMultipleLinks = getMultipleLinks;
// Stream an individual video
const streamVideo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const videoName = req.params.videoName;
        const assetFolder = path_1.default.join(__dirname, "..", "assets");
        const videoPath = path_1.default.join(assetFolder, videoName);
        // Check if the requested video exists in the assets folder
        if (!fs_1.default.existsSync(videoPath)) {
            res.status(404).json({ message: "Video not found" });
            return;
        }
        // Read the video file
        const videoStream = fs_1.default.createReadStream(videoPath);
        const stat = fs_1.default.statSync(videoPath);
        // Set the appropriate headers
        res.setHeader("Content-Type", "video/mp4");
        res.setHeader("Content-Length", stat.size);
        res.setHeader("Accept-Ranges", "bytes");
        // Pipe the video stream to the response
        videoStream.pipe(res);
    }
    catch (error) {
        res.status(400).json({ message: "Failed to stream video" });
    }
});
exports.streamVideo = streamVideo;
const updateVideos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = (0, express_validator_1.validationResult)(req);
    if (!result.isEmpty()) {
        res.status(400).json({ message: "Invalid data for video update" });
        return;
    }
    const { videoId } = req.params;
    const { title, url, likes } = req.body;
    try {
        // Assuming Video.updateVideos returns void
        yield video_1.default.updateVideos(videoId, title, url, likes);
        res.status(200).json({ message: "Successfully updated" });
    }
    catch (error) {
        console.error("Failed to update video:", error);
        res.status(500).json({ message: "Failed to update video" });
    }
});
exports.updateVideos = updateVideos;
const deleteVideos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { videoId } = req.params;
    try {
        // Retrieve the video details to get the filename
        const video = yield video_1.default.findById(videoId);
        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }
        // Delete the video file from the assets folder
        const assetFolder = path_1.default.join(__dirname, "..", "assets");
        // Check if video.url is defined before using it
        // Check if video.url is defined before using it
        const videoPath = (video === null || video === void 0 ? void 0 : video.url)
            ? path_1.default.join(assetFolder, video.url.split("/").pop())
            : undefined;
        if (videoPath && fs_1.default.existsSync(videoPath)) {
            fs_1.default.unlinkSync(videoPath);
        }
        else {
            console.warn("Video file not found:", videoPath);
        }
        // Delete the video from the database
        yield video_1.default.deleteVideos(videoId);
        res.status(200).json({ message: "Successfully deleted" });
    }
    catch (error) {
        console.error("Failed to delete video:", error);
        res.status(500).json({ message: "Failed to delete video" });
    }
});
exports.deleteVideos = deleteVideos;
const getAllVideoNamesWithLinks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const assetFolder = path_1.default.join(__dirname, "..", "assets");
        const videoFiles = fs_1.default
            .readdirSync(assetFolder)
            .filter((file) => file.endsWith(".mp4"));
        if (videoFiles.length === 0) {
            res.status(404).json({ message: "No videos found" });
            return;
        }
        // Create an array of video links
        const videoLinks = videoFiles.map((videoFile) => ({
            // name: videoFile,
            link: `/video/videos/names/${videoFile}`, // This is the link to the video streaming route
        }));
        res.status(200).json({ videoLinks });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to load video metadata" });
    }
});
exports.getAllVideoNamesWithLinks = getAllVideoNamesWithLinks;
const getAllVideosFromAssets = () => {
    const assetFolder = path_1.default.join(__dirname, "..", "assets");
    try {
        const videoFiles = fs_1.default
            .readdirSync(assetFolder)
            .filter((file) => file.endsWith(".mp4"));
        if (videoFiles.length === 0) {
            console.log("No videos found");
            return [];
        }
        return videoFiles;
    }
    catch (error) {
        console.error("Failed to load video metadata:", error);
        return [];
    }
};
exports.getAllVideosFromAssets = getAllVideosFromAssets;
const displayAllVideos = (req, res) => {
    const videoNames = (0, exports.getAllVideosFromAssets)();
    const videoURLs = videoNames.map((name) => {
        const videoURL = `/video/videos/names/${name}`;
        return {
            name,
            videoURL,
        };
    });
    if (videoURLs.length > 0) {
        res.status(200).json({ videos: videoURLs });
    }
    else {
        res.status(404).json({ message: "No videos found" });
    }
};
exports.displayAllVideos = displayAllVideos;
// videos CRUD
const getAllVideos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const videos = yield video_1.default.getVideos();
        res.status(200).json({ message: "Successfully loaded", videos: videos });
        console.log("Working");
    }
    catch (error) {
        res.status(400).json({ message: "Failed to load" });
    }
});
exports.getAllVideos = getAllVideos;
const addVideos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = (0, express_validator_1.validationResult)(req);
    if (!result.isEmpty()) {
        res.status(500).json({ message: "Can't add an empty video" });
        return;
    }
    const { title, url, likes } = req.body;
    try {
        const video = new video_1.default(title, url, likes);
        const videos = yield video.createVideo();
        res.status(200).json({ message: "Successfully added", videos: videos });
    }
    catch (error) {
        res.status(400).json({ message: "Failed to add" });
    }
});
exports.addVideos = addVideos;
const addLike = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { videoId } = req.params;
    try {
        const video = new video_1.default("", "", 0, videoId);
        const videos = yield video.addLike();
        console.log("Adding like to video with ID:", videoId);
        res
            .status(200)
            .json({ message: "Successfully added like", videos: videos });
    }
    catch (error) {
        console.error("Failed to add like:", error);
        res.status(400).json({ message: "Failed to add like" });
    }
});
exports.addLike = addLike;
const updateVideo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = (0, express_validator_1.validationResult)(req);
    if (!result.isEmpty()) {
        res.status(500).json({ message: "Can't update with empty data" });
        return;
    }
    const { videoId } = req.params;
    const { title, url, likes } = req.body;
    const video = new video_1.default(title, url, likes, videoId);
    try {
        const videos = yield video.updateVideo();
        res.status(200).json({ message: "Successfully updated", videos: videos });
    }
    catch (error) {
        res.status(400).json({ message: "Failed to update" });
    }
});
exports.updateVideo = updateVideo;
const deleteVideo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { videoId } = req.params;
    try {
        const videos = yield video_1.default.deleteVideo(videoId);
        res.status(200).json({ message: "Successfully deleted", videos: videos });
    }
    catch (error) {
        res.status(400).json({ message: "Failed to delete" });
    }
});
exports.deleteVideo = deleteVideo;
