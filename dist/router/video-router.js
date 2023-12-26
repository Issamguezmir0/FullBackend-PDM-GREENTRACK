"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const videoController = __importStar(require("../controller/video-controller"));
const express_validator_1 = require("express-validator");
const video_controller_1 = require("../controller/video-controller");
const video_controller_2 = require("../controller/video-controller");
const router = (0, express_1.Router)();
const videoValidator = (0, express_validator_1.body)("title").trim().notEmpty().isLength({ min: 3 });
router.get("/videos", videoController.getAllVideos);
router.get("/videos/name", videoController.getAllVideoNames);
router.get("/videos/names", videoController.getAllVideoNamesWithLinks);
router.get("/videos/names/:videoName", videoController.streamVideo);
router.patch("/videos/:videoId", videoController.updateVideos);
router.delete("/videos/:videoId", videoController.deleteVideos);
router.post("/add", videoController.addVideo);
router.post("/video", videoValidator, videoController.addVideos);
router.patch("/:videoId", videoValidator, videoController.updateVideo);
router.delete("/:videoId", videoController.deleteVideo);
router.get("/links", videoController.getMultipleLinks);
router.get("/videos/all", video_controller_2.displayAllVideos);
router.post("/:videoId/like", videoController.addLike);
router.get("/video/names", (req, res) => {
    const videoNames = (0, video_controller_1.getAllVideosFromAssets)();
    if (videoNames.length > 0) {
        res.status(200).json({ videoNames });
    }
    else {
        res.status(404).json({ message: "No videos found" });
    }
});
exports.default = router;
