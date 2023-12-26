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
const database_1 = require("../database");
const mongodb_1 = require("mongodb");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class Video {
    static updateVideos(videoId, title, url, likes) {
        throw new Error("Method not implemented.");
    }
    constructor(title, url, likes, id) {
        this.likes = 0;
        this.id = id;
        this.title = title;
        this.url = url;
        this.likes = likes;
    }
    addLike() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const db = database_1.Database.getDb();
                console.log("Updating likes for video with ID:", this.id);
                yield db
                    .collection("video")
                    .updateOne({ _id: new mongodb_1.ObjectId(this.id) }, { $inc: { likes: 1 } });
                const videos = yield Video.getVideos();
                console.log("Successfully updated likes. Updated videos:", videos);
                return videos;
            }
            catch (error) {
                console.error("Failed to update likes:", error);
                throw error;
            }
        });
    }
    createVideo() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = database_1.Database.getDb();
            delete this.id;
            yield db.collection("video").insertOne(Object.assign({}, this));
            const videos = yield Video.getVideos();
            return videos;
        });
    }
    static getVideos() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = database_1.Database.getDb();
            const documents = yield db.collection("video").find().toArray();
            const videos = documents.map((doc) => new Video(doc.title, doc.url, doc.likes, doc._id.toString()));
            return videos;
        });
    }
    static getVideosFromAssets() {
        return __awaiter(this, void 0, void 0, function* () {
            // List all files in the "assets" folder
            const assetFolder = path_1.default.join(__dirname, "..", "assets");
            const videoFiles = fs_1.default.readdirSync(assetFolder);
            // Map video file names to Video objects
            const videos = videoFiles.map((filename) => {
                return new Video(filename, `/assets/${filename}`, 0);
            });
            return videos;
        });
    }
    updateVideo() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = database_1.Database.getDb();
            yield db
                .collection("video")
                .updateOne({ _id: new mongodb_1.ObjectId(this.id) }, { $set: { title: this.title, url: this.url } });
            const videos = yield Video.getVideos();
            return videos;
        });
    }
    static findById(videoId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const db = database_1.Database.getDb();
                const video = yield db
                    .collection("video")
                    .findOne({ _id: new mongodb_1.ObjectId(videoId) });
                if (video) {
                    return new Video(video.title, video.url, video.likes, video._id.toString());
                }
                return null;
            }
            catch (error) {
                console.error("Failed to find video by ID:", error);
                throw error;
            }
        });
    }
    static deleteVideo(todoId) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = database_1.Database.getDb();
            yield db.collection("video").deleteOne({ _id: new mongodb_1.ObjectId(todoId) });
            const videos = yield Video.getVideos();
            return videos;
        });
    }
    static findOneByTitle(title) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = database_1.Database.getDb();
            const video = yield db.collection("video").findOne({ title });
            if (video) {
                return new Video(video.title, video.url, video.likes, video._id.toString());
            }
            return null; // Or handle appropriately if no video found with the given title
        });
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = database_1.Database.getDb();
            delete this.id;
            yield db.collection("video").insertOne(Object.assign({}, this));
        });
    }
    updateVideos(videoId, title, url, likes) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const db = database_1.Database.getDb();
                // Find the video by ID
                const existingVideo = yield db
                    .collection("video")
                    .findOne({ _id: new mongodb_1.ObjectId(videoId) });
                // If the video doesn't exist, return null
                if (!existingVideo) {
                    return null;
                }
                // Update the video details
                yield db
                    .collection("video")
                    .updateOne({ _id: new mongodb_1.ObjectId(videoId) }, { $set: { title, url, likes } });
                // Return the updated video
                return new Video(title, url, likes, videoId);
            }
            catch (error) {
                console.error("Failed to update video:", error);
                throw error;
            }
        });
    }
    static deleteVideos(videoId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const db = database_1.Database.getDb();
                // Delete the video by ID
                yield db.collection("video").deleteOne({ _id: new mongodb_1.ObjectId(videoId) });
            }
            catch (error) {
                console.error("Failed to delete video:", error);
                throw error;
            }
        });
    }
}
exports.default = Video;
